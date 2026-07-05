"use client"

export default function OceanBackground() {
  return (
    <>
      {/* Base deep ocean gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 20%, #1e3a5f 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, #0f2540 0%, transparent 50%),
            linear-gradient(180deg, #0a1628 0%, #0f1f38 50%, #0a1628 100%)
          `,
        }}
      />

      {/* Subtle animated shimmer layer */}
      <div
        className="absolute inset-0 opacity-30 animate-ocean-drift"
        style={{
          background: `
            radial-gradient(circle at 20% 30%, rgba(100, 149, 237, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 80% 60%, rgba(70, 130, 180, 0.06) 0%, transparent 40%),
            radial-gradient(circle at 50% 90%, rgba(120, 170, 220, 0.05) 0%, transparent 40%)
          `,
        }}
      />

      {/* Ambient light spots */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(ellipse 800px 400px at 25% 25%, rgba(180, 200, 240, 0.06) 0%, transparent 60%),
            radial-gradient(ellipse 600px 300px at 75% 65%, rgba(140, 180, 220, 0.05) 0%, transparent 60%)
          `,
        }}
      />

      {/* Fine noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }}
      />

      {/* Vignette edges — makes center feel focal */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 50%, rgba(0, 0, 0, 0.4) 100%)",
        }}
      />
    </>
  )
}