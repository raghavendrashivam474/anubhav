import Link from "next/link"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col">
      <header className="px-8 py-6 flex justify-between items-center border-b border-stone-200">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Anubhav</h1>
          <p className="text-xs text-stone-400">Personal Wisdom Space</p>
        </div>
        <div className="flex gap-3">
          <Link href="/sign-in" className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors">
            Sign In
          </Link>
          <Link href="/sign-up" className="px-4 py-2 text-sm bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors">
            Get Started
          </Link>
        </div>
      </header>

      <section className="flex-1 flex flex-col items-center justify-center px-8 py-24 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-medium text-stone-400 uppercase tracking-widest">Your Personal Wisdom Space</p>
            <h2 className="text-5xl font-light text-stone-800 leading-tight">
              Preserve experiences today.
              <br />
              <span className="text-stone-500">Retrieve wisdom tomorrow.</span>
            </h2>
          </div>
          <p className="text-lg text-stone-500 leading-relaxed max-w-xl mx-auto">
            Capture meaningful experiences, extract lessons with AI, and resurface wisdom when you need it most.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/sign-up" className="px-8 py-3 text-sm bg-stone-800 hover:bg-stone-700 text-white rounded-lg transition-colors">
              Begin Your Journey
            </Link>
            <Link href="/sign-in" className="px-8 py-3 text-sm border border-stone-300 text-stone-600 hover:bg-stone-100 rounded-lg transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="px-8 py-16 border-t border-stone-200 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-light text-lg">1</div>
            <h3 className="font-medium text-stone-800">Capture</h3>
            <p className="text-sm text-stone-500">Record experiences as they happen. Raw, unfiltered, honest.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-light text-lg">2</div>
            <h3 className="font-medium text-stone-800">Extract</h3>
            <p className="text-sm text-stone-500">AI transforms raw experiences into structured lessons and wisdom.</p>
          </div>
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 font-light text-lg">3</div>
            <h3 className="font-medium text-stone-800">Retrieve</h3>
            <p className="text-sm text-stone-500">Search by meaning, not just words. Find wisdom when you need it.</p>
          </div>
        </div>
      </section>

      <footer className="px-8 py-6 border-t border-stone-200 text-center">
        <p className="text-xs text-stone-400">Anubhav - Personal Wisdom Preservation System</p>
      </footer>
    </main>
  )
}