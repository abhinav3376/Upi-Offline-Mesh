import { meshApi } from '../api/client.js';
import { usePolling } from '../hooks/usePolling.js';

const STATUS_STYLE = {
  SETTLED: 'text-mint bg-mint/10 border-mint/30',
  REJECTED: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
};

export default function Transactions() {
  const { data: txs } = usePolling(() => meshApi.transactions(), 2000);

  return (
    <div className="bg-panel border border-panelborder rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs font-mono text-sub uppercase border-b border-panelborder">
            <th className="px-4 py-3">ID</th>
            <th className="px-4 py-3">From</th>
            <th className="px-4 py-3">To</th>
            <th className="px-4 py-3">Amount</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Bridge</th>
            <th className="px-4 py-3">Hops</th>
            <th className="px-4 py-3">Settled at</th>
          </tr>
        </thead>
        <tbody>
          {(!txs || txs.length === 0) && (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-sub text-sm">
                No transactions yet — inject a packet and flush the bridges from Mesh Topology.
              </td>
            </tr>
          )}
          {txs?.map((t) => (
            <tr key={t.id} className="border-b border-panelborder/60 hover:bg-white/5">
              <td className="px-4 py-3 font-mono text-xs text-sub">#{t.id}</td>
              <td className="px-4 py-3">{t.senderVpa}</td>
              <td className="px-4 py-3">{t.receiverVpa}</td>
              <td className="px-4 py-3 font-mono">₹{Number(t.amount).toFixed(2)}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full border ${STATUS_STYLE[t.status] || ''}`}>
                  {t.status}
                </span>
              </td>
              <td className="px-4 py-3 text-sub">{t.bridgeNodeId}</td>
              <td className="px-4 py-3 text-sub">{t.hopCount}</td>
              <td className="px-4 py-3 text-sub text-xs">
                {t.settledAt ? new Date(t.settledAt).toLocaleTimeString() : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
