# ANUBHAV

# Engineering Incident Record #001

Incident ID:
ANB-INC-001

Date:
[Date]

Severity:
Low

Impact:
Development Blocker

Status:
Resolved

---

# Title

PostgreSQL Authentication Failure Caused by Host-Level Port Conflict

---

# Summary

While resuming development, all database requests began failing with:

password authentication failed for user "anubhav"

At first glance, the issue appeared to be:

* Incorrect credentials
* Corrupted database volume
* Misconfigured environment variables

The actual root cause was different.

A native PostgreSQL 17 service running on Windows had already occupied localhost:5432.

As a result:

* Host-side Python applications connected to Windows PostgreSQL
* Dockerized PostgreSQL never received those requests

This created a misleading situation where:

Identical credentials worked from inside Docker but failed from the host.

---

# Symptoms

Observed:

GET /health

Returned:

password authentication failed for user "anubhav"

---

Observed:

docker exec psql

Result:

Successful login

---

Observed:

asyncpg connection from host

Result:

Authentication failure

---

# Investigation

Step 1

Verified Docker container status.

Result:

Healthy.

---

Step 2

Compared:

.env

docker-compose.yml

Credentials matched.

---

Step 3

Connected from inside container.

Result:

Success.

---

Step 4

Connected from host using asyncpg.

Result:

Failure.

---

Step 5

Bypassed SQLAlchemy.

Used raw asyncpg.

Result:

Failure.

---

Step 6

Checked Windows services.

Command:

Get-Service

Result:

postgresql-x64-17 service discovered.

Root cause identified.

---

# Root Cause

Two PostgreSQL instances existed simultaneously.

Instance A

Docker PostgreSQL

Port:

5432 (container)

Expected target.

---

Instance B

Native Windows PostgreSQL 17

Port:

5432 (host)

Unexpected target.

---

Host-side applications reached:

Windows PostgreSQL

instead of

Docker PostgreSQL

Therefore:

Authentication failed correctly because:

User:

anubhav

did not exist in the Windows instance.

---

# Resolution

Changed Docker mapping.

Previous:

5432:5432

Updated:

5433:5432

Updated:

DATABASE_URL

to use:

localhost:5433

Recreated containers.

Retested connections.

---

# Verification

Health Endpoint

Status:

PASS

---

Database Connectivity

Status:

PASS

---

pgvector Extension

Status:

PASS

---

Authentication

Status:

PASS

---

CRUD Endpoints

Status:

PASS

---

# Lesson Learned

Important Principle:

When identical credentials behave differently across clients, investigate service identity before investigating credentials.

The question is often not:

"Is the password correct?"

The question is:

"Which service is answering?"

---

# Preventive Measures

1. Use port 5433 for local Docker PostgreSQL.

2. Document port usage in README.

3. Add troubleshooting section to onboarding guide.

4. Verify database identity during debugging.

5. Always test both:

* Container-side connections
* Host-side connections

---

# Knowledge Base Entry

Category:

Infrastructure

Tags:

postgres
docker
port-conflict
authentication
debugging

Reusable Insight:

Authentication errors can be caused by connecting to the wrong service, even when credentials are correct.

Always verify endpoint identity before investigating credentials.

---

# Current Project State After Resolution

Infrastructure:
✅ Healthy

Database:
✅ Healthy

Authentication:
✅ Healthy

CRUD:
✅ Healthy

Search:
🚧 Next

AI Extraction:
⏳ Pending

Frontend:
⏳ Pending

Deployment:
⏳ Pending
