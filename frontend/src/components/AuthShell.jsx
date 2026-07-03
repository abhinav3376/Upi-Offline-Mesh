export default function AuthShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* ambient mesh dots, purely decorative */}
      <div className="absolute inset-0 -z-10 opacity-40">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="#1b2230" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-9 h-9 rounded-lg bg-mint/10 border border-mint/30 flex items-center justify-center text-mint">
            ✳
          </div>
          <span className="font-mono font-semibold tracking-tight">UPI Offline Mesh</span>
        </div>

        <div className="bg-panel border border-panelborder rounded-2xl p-7 shadow-xl">
          <h1 className="text-xl font-semibold mb-1">{title}</h1>
          <p className="text-sm text-sub mb-6">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
