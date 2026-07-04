"use client"

import { useState } from "react"
import Link from "next/link"
import { keywordSearch, semanticSearch } from "@/services/api"
import { SearchResult } from "@/types"
import { Search, Sparkles } from "lucide-react"

type SearchMode = "keyword" | "meaning"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [mode, setMode] = useState<SearchMode>("keyword")
  const [results, setResults] = useState<SearchResult[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    setSearched(true)
    try {
      const data = mode === "keyword"
        ? await keywordSearch(query)
        : await semanticSearch(query)
      setResults(data?.items || [])
      setTotal(data?.total || 0)
    } catch (e) {
      console.error(e)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-stone-800">Search</h2>
        <p className="text-stone-400 mt-1">Find wisdom from your experiences</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setMode("keyword")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
            mode === "keyword" ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <Search size={14} /> Keyword
        </button>
        <button
          onClick={() => setMode("meaning")}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-colors ${
            mode === "meaning" ? "bg-stone-800 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          <Sparkles size={14} /> Meaning
        </button>
      </div>

      <p className="text-xs text-stone-400 -mt-4">
        {mode === "keyword"
          ? "Search by exact words in your experiences."
          : "Search by meaning — finds related experiences even without exact words."}
      </p>

      <div className="flex gap-3">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder={mode === "keyword" ? "Search for a word or phrase..." : "What are you trying to understand?"}
          className="flex-1 px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-300"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          className="px-6 py-2.5 bg-stone-800 hover:bg-stone-700 text-white text-sm rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      {searched && (
        <div className="space-y-4">
          <p className="text-sm text-stone-500">{total} result{total !== 1 ? "s" : ""} for "{query}"</p>
          {results.length === 0 ? (
            <div className="p-8 text-center border border-stone-200 border-dashed rounded-xl bg-white">
              <p className="text-stone-400 text-sm">No results found.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map(item => (
                <Link key={item.id} href={`/experiences/${item.id}`} className="block p-5 bg-white border border-stone-200 rounded-xl hover:shadow-md transition-shadow group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <p className="text-sm text-stone-700 line-clamp-2 group-hover:text-stone-900">{item.what_happened}</p>
                      {item.lesson && (
                        <p className="text-xs text-stone-400 italic">"{item.lesson}"</p>
                      )}
                      <div className="flex gap-2 flex-wrap">
                        {(item.tags || []).slice(0, 3).map(tag => (
                          <span key={tag.id} className="text-xs px-2 py-0.5 bg-stone-100 text-stone-500 rounded-full">{tag.name}</span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs px-2 py-1 bg-stone-100 text-stone-500 rounded-full capitalize">{item.category}</span>
                      {item.similarity_score !== undefined && (
                        <span className="text-xs text-stone-400">{Math.round(item.similarity_score * 100)}% match</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}