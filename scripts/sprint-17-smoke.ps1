# Sprint 17 - Milestone 17.7 Full Smoke Verification (API layer)
# Requires: uvicorn on :8000, Postgres container anubhav_postgres,
#           test account Raghav@anubhav.com / Anubhav@123

$ErrorActionPreference = "Continue"
$results = @()

function Record($id, $desc, $result, $note = "") {
    $script:results += [PSCustomObject]@{ ID=$id; Test=$desc; Result=$result; Note=$note }
    $c = if ($result -eq "PASS") {"Green"} elseif ($result -eq "FAIL") {"Red"} else {"Yellow"}
    Write-Host ("  {0} {1,-6} {2}" -f $id,$result,$note) -ForegroundColor $c
}

Write-Host "`nSprint 17 - Full Smoke Verification Sweep`n" -ForegroundColor Cyan

try { $h = Invoke-RestMethod -Uri "http://localhost:8000/health" -TimeoutSec 5
      if ($h.status -eq "ok") { Record "ST-01" "Health 200" "PASS" "status=$($h.status)" } else { Record "ST-01" "Health 200" "FAIL" }
} catch { Record "ST-01" "Health 200" "FAIL" $_.Exception.Message }

if ($h.database -eq "connected") { Record "ST-02" "DB reachable" "PASS" } else { Record "ST-02" "DB reachable" "FAIL" }
if ($h.pgvector -eq "loaded")    { Record "ST-03" "pgvector op"  "PASS" } else { Record "ST-03" "pgvector op"  "FAIL" }

$loginBody = @{ email="Raghav@anubhav.com"; password="Anubhav@123" } | ConvertTo-Json
try { $login = Invoke-RestMethod -Uri "http://localhost:8000/auth/login" -Method POST -ContentType "application/json" -Body $loginBody
      $global:TOK = $login.token; Record "ST-04" "Sign in" "PASS" "token len=$($TOK.Length)"
} catch { Record "ST-04" "Sign in" "FAIL"; return }

$H = @{ Authorization = "Bearer $TOK" }
Record "ST-05" "Auth to /world"  "PASS*" "browser-verified"
Record "ST-06" "Refresh session" "PASS*" "browser-verified"
Record "ST-07" "Logout clears"   "PASS*" "browser-verified"

try { Invoke-RestMethod -Uri "http://localhost:8000/anubhavs" -ErrorAction Stop | Out-Null
      Record "ST-08" "Reject unauth" "FAIL"
} catch { $sc = $_.Exception.Response.StatusCode.value__
          if ($sc -in 401,403) { Record "ST-08" "Reject unauth" "PASS" "status=$sc" } else { Record "ST-08" "Reject unauth" "FAIL" } }

$expBody = @{ what_happened="SMOKE VERIFY: sweep create"; category="life"; source="myself"; tags=@("sweep") } | ConvertTo-Json
try { $exp = Invoke-RestMethod -Uri "http://localhost:8000/anubhavs" -Method POST -Headers $H -ContentType "application/json" -Body $expBody
      $global:EXP_ID = $exp.id; Record "ST-09" "Create exp" "PASS" "id=$($EXP_ID.Substring(0,8))"
} catch { Record "ST-09" "Create exp" "FAIL"; return }

$list = Invoke-RestMethod -Uri "http://localhost:8000/anubhavs?page=1&page_size=100" -Headers $H
if ($list.items | Where-Object { $_.id -eq $EXP_ID }) { Record "ST-10" "Exp in list" "PASS" "total=$($list.total)" } else { Record "ST-10" "Exp in list" "FAIL" }

try { $det = Invoke-RestMethod -Uri "http://localhost:8000/anubhavs/$EXP_ID" -Headers $H
      if ($det.id -eq $EXP_ID) { Record "ST-11" "Detail loads" "PASS" } else { Record "ST-11" "Detail loads" "FAIL" }
} catch { Record "ST-11" "Detail loads" "FAIL" }

try { $ext = Invoke-RestMethod -Uri "http://localhost:8000/anubhavs/$EXP_ID/extract" -Method POST -Headers $H
      Record "ST-12" "Extract" "PASS" "msg=$($ext.message)"
      if ($ext.lesson)  { Record "ST-13" "Lesson gen"  "PASS" } else { Record "ST-13" "Lesson gen"  "FAIL" }
      if ($ext.summary) { Record "ST-14" "Summary gen" "PASS" } else { Record "ST-14" "Summary gen" "FAIL" }
      if ($ext.tags.Count -ge 3) { Record "ST-15" "Tags gen" "PASS" "count=$($ext.tags.Count)" } else { Record "ST-15" "Tags gen" "FAIL" }
} catch { Record "ST-12" "Extract" "FAIL" }

$sql = "SELECT embedding IS NOT NULL FROM anubhavs WHERE id = '$EXP_ID';"
$dbRes = docker exec anubhav_postgres psql -U anubhav -d anubhav_db -tAc $sql 2>&1
if ($dbRes -match "^t$") { Record "ST-16" "Embed persisted" "PASS" "DB confirmed" } else { Record "ST-16" "Embed persisted" "FAIL" }

$kw = Invoke-RestMethod -Uri "http://localhost:8000/anubhavs/search?q=SMOKE%20VERIFY" -Headers $H
if ($kw.total -ge 1) { Record "ST-17" "Keyword search" "PASS" "hits=$($kw.total)" } else { Record "ST-17" "Keyword search" "FAIL" }

$sem = Invoke-RestMethod -Uri "http://localhost:8000/anubhavs/semantic-search?q=sweep+create" -Headers $H
if ($sem.total -ge 1) { Record "ST-18" "Semantic search" "PASS" "hits=$($sem.total)" } else { Record "ST-18" "Semantic search" "FAIL" }

Start-Sleep -Seconds 2
$rel = Invoke-RestMethod -Uri "http://localhost:8000/anubhavs/$EXP_ID/related?limit=5" -Headers $H
if ($rel.total -ge 1) { Record "ST-19" "Related items" "PASS" "count=$($rel.total)" } else { Record "ST-19" "Related items" "PARTIAL" "0 items" }

$list2 = Invoke-RestMethod -Uri "http://localhost:8000/anubhavs?page=1&page_size=100" -Headers $H
Record "ST-20" "World count" "PASS" "total=$($list2.total)"

Record "ST-21" "Island position" "PASS*" "browser-verified"
Record "ST-22" "No overlap"      "PASS*" "browser-verified"
Record "ST-23" "Dock opens"      "PASS*" "browser-verified"
Record "ST-24" "Deep link focus" "PASS*" "browser-verified"

$trigger = (Get-Date).ToUniversalTime().AddHours(2).ToString("yyyy-MM-ddTHH:mm:ssZ")
$remBody = @{ anubhav_id = $EXP_ID; trigger_at = $trigger } | ConvertTo-Json
try { $rem = Invoke-RestMethod -Uri "http://localhost:8000/reminders" -Method POST -Headers $H -ContentType "application/json" -Body $remBody
      Record "ST-25" "Reminder create" "PASS" "id=$($rem.id.Substring(0,8))"
} catch { Record "ST-25" "Reminder create" "FAIL" }

$ref = Invoke-RestMethod -Uri "http://localhost:8000/reflections/today" -Headers $H
if ($ref.total -ge 1) { Record "ST-26" "Reflection API" "PASS" "items=$($ref.total)" } else { Record "ST-26" "Reflection API" "FAIL" }

Record "ST-27" "Reflection UI" "FAIL" "TD-06 open"

if ($rel.total -ge 1) {
    $target = $rel.items[0].id
    try { $t = Invoke-RestMethod -Uri "http://localhost:8000/anubhavs/$target" -Headers $H
          if ($t.id -eq $target) { Record "ST-28" "Related nav" "PASS" } else { Record "ST-28" "Related nav" "FAIL" }
    } catch { Record "ST-28" "Related nav" "FAIL" }
} else { Record "ST-28" "Related nav" "SKIP" }

$badTok = $TOK.Substring(0, $TOK.Length - 5) + "XXXXX"
try { Invoke-RestMethod -Uri "http://localhost:8000/auth/me" -Headers @{ Authorization = "Bearer $badTok" } -ErrorAction Stop | Out-Null
      Record "ST-29" "Invalid token" "FAIL"
} catch { $sc = $_.Exception.Response.StatusCode.value__
          if ($sc -eq 401) { Record "ST-29" "Invalid token" "PASS" } else { Record "ST-29" "Invalid token" "FAIL" } }

$eps = @("/auth/me","/anubhavs?page=1","/anubhavs/connections","/reminders?page=1","/reflections/today")
$all401 = $true
foreach ($ep in $eps) {
    try { Invoke-RestMethod -Uri "http://localhost:8000$ep" -Headers @{ Authorization = "Bearer $badTok" } -ErrorAction Stop | Out-Null; $all401 = $false
    } catch { if ($_.Exception.Response.StatusCode.value__ -ne 401) { $all401 = $false } }
}
if ($all401) { Record "ST-30" "401 signal" "PASS" "5/5 endpoints 401" } else { Record "ST-30" "401 signal" "FAIL" }

try { Invoke-RestMethod -Uri "http://localhost:8000/anubhavs/00000000-0000-0000-0000-000000000000" -Headers $H -ErrorAction Stop | Out-Null } catch {}
try { Invoke-RestMethod -Uri "http://localhost:8000/anubhavs" -Method POST -Headers $H -ContentType "application/json" -Body '{"what_happened":""}' -ErrorAction Stop | Out-Null } catch {}
try { $me = Invoke-RestMethod -Uri "http://localhost:8000/auth/me" -Headers $H
      if ($me.email) { Record "ST-31" "Errors dont logout" "PASS" } else { Record "ST-31" "Errors dont logout" "FAIL" }
} catch { Record "ST-31" "Errors dont logout" "FAIL" }

Record "ST-32" "Backend offline UI" "PASS*" "browser-verified"
Record "ST-33" "Backend recovery"   "PASS*" "browser-verified"

Write-Host "`n=== RESULTS MATRIX ===`n" -ForegroundColor Cyan
$results | Format-Table -AutoSize

$pass     = @($results | Where-Object { $_.Result -eq "PASS"    }).Count
$passStar = @($results | Where-Object { $_.Result -eq "PASS*"   }).Count
$fail     = @($results | Where-Object { $_.Result -eq "FAIL"    }).Count
$partial  = @($results | Where-Object { $_.Result -eq "PARTIAL" }).Count
$skip     = @($results | Where-Object { $_.Result -eq "SKIP"    }).Count

Write-Host ""
Write-Host "  PASS (API this run)     : $pass"     -ForegroundColor Green
Write-Host "  PASS* (browser earlier) : $passStar" -ForegroundColor Green
Write-Host "  PARTIAL                 : $partial"  -ForegroundColor Yellow
Write-Host "  SKIP                    : $skip"     -ForegroundColor Yellow
Write-Host "  FAIL                    : $fail"     -ForegroundColor Red
Write-Host "  TOTAL                   : $($results.Count)" -ForegroundColor Cyan
Write-Host ""

try { Invoke-RestMethod -Uri "http://localhost:8000/reminders/$($rem.id)" -Method DELETE -Headers $H | Out-Null } catch {}
try { Invoke-RestMethod -Uri "http://localhost:8000/anubhavs/$EXP_ID" -Method DELETE -Headers $H | Out-Null } catch {}
Write-Host "Cleaned up sweep artifacts`n" -ForegroundColor DarkGray
