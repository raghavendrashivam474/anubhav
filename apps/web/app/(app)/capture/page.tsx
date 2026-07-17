"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  Book,
  Upload,
  Loader2,
  ArrowLeft,
  ArrowRight,
  Check,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { uploadForOcr, submitCapture } from "@/services/api"
import type {
  CaptureSource,
  OcrResult,
  BookMetadata,
  WisdomEntry,
} from "@/types"

type Step = "source" | "image" | "insight" | "metadata" | "review" | "processing" | "success"

const MIN_INSIGHT = 50

// IMPORTANT: Container and Header defined OUTSIDE the component.
// If defined inside, React remounts them on every render, which
// unmounts the textarea and resets the cursor position on every keystroke.
function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-2xl">{children}</div>
    </div>
  )
}

function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8">
      <Link
        href="/world"
        className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-300 mb-4"
      >
        <ArrowLeft size={12} /> Back to world
      </Link>
      <h1 className="text-2xl font-light">{title}</h1>
      {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
    </div>
  )
}

export default function CapturePage() {
  const router = useRouter()

  const [step, setStep] = useState<Step>("source")
  const [source, setSource] = useState<CaptureSource>("book")

  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [ocrText, setOcrText] = useState("")
  const [ocrLoading, setOcrLoading] = useState(false)
  const [ocrError, setOcrError] = useState<string | null>(null)

  const [insight, setInsight] = useState("")

  const [bookTitle, setBookTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [pageNumber, setPageNumber] = useState("")

  const [submitError, setSubmitError] = useState<string | null>(null)
  const [created, setCreated] = useState<WisdomEntry | null>(null)

  const handleImageChange = async (file: File | null) => {
    if (!file) return
    setImagePreview(URL.createObjectURL(file))
    setOcrError(null)
    setOcrLoading(true)
    try {
      const result: OcrResult = await uploadForOcr(file)
      setOcrText(result.extracted_text)
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      setOcrError(
        detail?.message ||
        detail ||
        "Could not extract text from this image. You can type it manually."
      )
    } finally {
      setOcrLoading(false)
    }
  }

  const handleSubmit = async () => {
    setStep("processing")
    setSubmitError(null)
    try {
      const metadata: BookMetadata = {}
      if (bookTitle.trim()) metadata.book_title = bookTitle.trim()
      if (author.trim()) metadata.author = author.trim()
      if (pageNumber.trim()) metadata.page_number = pageNumber.trim()

      const entry: WisdomEntry = await submitCapture({
        source,
        ocr_text: ocrText.trim(),
        personal_insight: insight.trim(),
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      })
      setCreated(entry)
      setStep("success")
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      setSubmitError(
        detail?.message ||
        detail ||
        "Something went wrong. Please try again."
      )
      setStep("review")
    }
  }

  const reset = () => {
    setStep("source")
    setImagePreview(null)
    setOcrText("")
    setOcrError(null)
    setInsight("")
    setBookTitle("")
    setAuthor("")
    setPageNumber("")
    setSubmitError(null)
    setCreated(null)
  }

  if (step === "source") {
    return (
      <Container>
        <Header title="Capture wisdom" subtitle="Where did this insight come from?" />
        <div className="grid gap-3">
          <button
            onClick={() => { setSource("book"); setStep("image") }}
            className="flex items-center gap-4 p-5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition"
          >
            <Book size={24} className="text-amber-400" />
            <div>
              <div className="font-medium">Book</div>
              <div className="text-xs text-slate-500 mt-0.5">Photograph a page and extract wisdom</div>
            </div>
          </button>
          <div className="p-5 bg-slate-900/40 border border-slate-900 rounded-xl opacity-40 cursor-not-allowed">
            <div className="text-sm text-slate-500">PDF, Voice, Podcast, Website - coming soon</div>
          </div>
        </div>
      </Container>
    )
  }

  if (step === "image") {
    return (
      <Container>
        <Header title="Photograph the page" subtitle="Upload a clear image. We will extract the text automatically." />
        {!imagePreview ? (
          <label className="flex flex-col items-center justify-center gap-3 p-12 border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition">
            <Upload size={28} className="text-slate-500" />
            <span className="text-sm text-slate-400">Click to upload image</span>
            <span className="text-xs text-slate-600">JPEG, PNG, or WEBP, max 10MB</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={(e) => handleImageChange(e.target.files?.[0] ?? null)}
            />
          </label>
        ) : (
          <div className="space-y-4">
            <img src={imagePreview} alt="Uploaded page" className="w-full max-h-64 object-contain rounded-lg border border-slate-800" />
            {ocrLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Loader2 size={14} className="animate-spin" /> Extracting text...
              </div>
            )}
            {ocrError && (
              <div className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-900/50 rounded-lg text-sm text-red-300">
                <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                <span>{ocrError}</span>
              </div>
            )}
            {!ocrLoading && (
              <>
                <label className="block text-xs text-slate-500 mb-1">Extracted text (you can edit)</label>
                <textarea
                  value={ocrText}
                  onChange={(e) => setOcrText(e.target.value)}
                  placeholder="Extracted text will appear here..."
                  className="w-full h-40 p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 resize-y focus:outline-none focus:border-slate-600"
                />
              </>
            )}
          </div>
        )}
        <div className="flex justify-between mt-8">
          <button onClick={() => setStep("source")} className="text-sm text-slate-500 hover:text-slate-300">Back</button>
          <button
            onClick={() => setStep("insight")}
            disabled={!ocrText.trim() || ocrLoading}
            className="flex items-center gap-1 px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight size={14} />
          </button>
        </div>
      </Container>
    )
  }

  if (step === "insight") {
    const insightLen = insight.trim().length
    const isValid = insightLen >= MIN_INSIGHT
    return (
      <Container>
        <Header title="Your insight" subtitle="What does this passage mean to you personally?" />
        <textarea
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="This made me think about..."
          autoFocus
          className="w-full h-48 p-4 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 resize-y focus:outline-none focus:border-slate-600"
        />
        <div className="flex items-center justify-between mt-2 text-xs">
          <span className={isValid ? "text-emerald-400" : "text-slate-500"}>
            {insightLen} / {MIN_INSIGHT} minimum
          </span>
          {isValid && <Check size={12} className="text-emerald-400" />}
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={() => setStep("image")} className="text-sm text-slate-500 hover:text-slate-300">Back</button>
          <button
            onClick={() => setStep("metadata")}
            disabled={!isValid}
            className="flex items-center gap-1 px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Continue <ArrowRight size={14} />
          </button>
        </div>
      </Container>
    )
  }

  if (step === "metadata") {
    return (
      <Container>
        <Header title="Book details" subtitle="Optional - helps you find this later" />
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Book title</label>
            <input type="text" value={bookTitle} onChange={(e) => setBookTitle(e.target.value)} placeholder="e.g. The Obstacle Is the Way"
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-slate-600" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Author</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="e.g. Ryan Holiday"
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-slate-600" />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Page number</label>
            <input type="text" value={pageNumber} onChange={(e) => setPageNumber(e.target.value)} placeholder="e.g. 42"
              className="w-full p-3 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-slate-600" />
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={() => setStep("insight")} className="text-sm text-slate-500 hover:text-slate-300">Back</button>
          <button onClick={() => setStep("review")} className="flex items-center gap-1 px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium">
            Continue <ArrowRight size={14} />
          </button>
        </div>
      </Container>
    )
  }

  if (step === "review") {
    return (
      <Container>
        <Header title="Review" subtitle="Everything look right?" />
        <div className="space-y-6">
          <section>
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Extracted text</div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 whitespace-pre-wrap">{ocrText}</div>
          </section>
          <section>
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Your insight</div>
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 whitespace-pre-wrap">{insight}</div>
          </section>
          {(bookTitle || author || pageNumber) && (
            <section>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Book details</div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300 space-y-1">
                {bookTitle && <div><span className="text-slate-500">Title:</span> {bookTitle}</div>}
                {author && <div><span className="text-slate-500">Author:</span> {author}</div>}
                {pageNumber && <div><span className="text-slate-500">Page:</span> {pageNumber}</div>}
              </div>
            </section>
          )}
          {submitError && (
            <div className="flex items-start gap-2 p-3 bg-red-950/30 border border-red-900/50 rounded-lg text-sm text-red-300">
              <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
              <span>{submitError}</span>
            </div>
          )}
        </div>
        <div className="flex justify-between mt-8">
          <button onClick={() => setStep("metadata")} className="text-sm text-slate-500 hover:text-slate-300">Back</button>
          <button onClick={handleSubmit} className="flex items-center gap-2 px-5 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium">
            <Sparkles size={14} /> Submit
          </button>
        </div>
      </Container>
    )
  }

  if (step === "processing") {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 size={32} className="animate-spin text-slate-400" />
          <p className="text-slate-400 text-sm">Extracting wisdom from your reading...</p>
          <p className="text-slate-600 text-xs">This may take a few seconds.</p>
        </div>
      </Container>
    )
  }

  if (step === "success" && created) {
    return (
      <Container>
        <div className="text-center py-8 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-950/50 border border-emerald-900/50 mb-4">
            <Check size={24} className="text-emerald-400" />
          </div>
          <h1 className="text-xl font-light">Wisdom captured</h1>
        </div>
        <div className="space-y-4">
          {created.lesson && (
            <section>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Lesson</div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200">{created.lesson}</div>
            </section>
          )}
          {created.summary && (
            <section>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Summary</div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-300">{created.summary}</div>
            </section>
          )}
          {created.tags && created.tags.length > 0 && (
            <section>
              <div className="text-xs uppercase tracking-wide text-slate-500 mb-2">Tags</div>
              <div className="flex flex-wrap gap-2">
                {created.tags.map(tag => (
                  <span key={tag.id} className="px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-full text-xs text-slate-400">
                    {tag.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
        <div className="flex gap-3 mt-8">
          <button onClick={reset} className="flex-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-sm">
            Capture another
          </button>
          <button onClick={() => router.push("/world")} className="flex-1 px-4 py-2 bg-white text-slate-900 rounded-lg text-sm font-medium">
            View in World
          </button>
        </div>
      </Container>
    )
  }

  return null
}
