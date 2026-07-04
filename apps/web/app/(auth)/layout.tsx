export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-stone-50 flex flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold text-stone-800">Anubhav</h1>
        <p className="text-sm text-stone-400 mt-1">Personal Wisdom Space</p>
      </div>
      {children}
    </main>
  )
}