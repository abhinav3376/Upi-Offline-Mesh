import { meshApi } from '../api/client.js';
import { usePolling } from '../hooks/usePolling.js';

export default function Accounts() {
  const { data: accounts } = usePolling(() => meshApi.accounts(), 2000);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {(accounts || []).map((a) => (
        <div key={a.vpa} className="bg-panel border border-panelborder rounded-xl p-5">
          <div className="text-sm text-sub">{a.name}</div>
          <div className="text-xs font-mono text-sub mb-3">{a.vpa}</div>
          <div className="text-2xl font-semibold text-mint">₹{Number(a.balance).toFixed(2)}</div>
        </div>
      ))}
      {(!accounts || accounts.length === 0) && (
        <div className="col-span-full text-sm text-sub">Loading accounts…</div>
      )}
    </div>
  );
}
