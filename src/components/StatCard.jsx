export default function StatCard({ label, value, sub, accent = false }) {
  return (
    <div className="bg-panel border border-panelborder rounded-xl px-5 py-4">
      <div className="text-xs font-mono text-sub uppercase tracking-wide">{label}</div>
      <div className={`text-2xl font-semibold mt-1.5 ${accent ? 'text-mint' : 'text-ink'}`}>
        {value}
      </div>
      {sub && <div className="text-xs text-sub mt-1">{sub}</div>}
    </div>
  );
}
