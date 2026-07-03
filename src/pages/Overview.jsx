import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { meshApi } from '../api/client.js';
import { usePolling } from '../hooks/usePolling.js';
import StatCard from '../components/StatCard.jsx';
import PacketFlowCanvas from '../components/PacketFlowCanvas.jsx';

export default function Overview() {
  const { data: state } = usePolling(() => meshApi.state(), 2000);
  const { data: txs } = usePolling(() => meshApi.transactions(), 2500);

  const devices = state?.devices || [];
  const online = devices.filter((d) => d.hasInternet).length;
  const packetsInMesh = devices.reduce((sum, d) => sum + d.packetCount, 0);

  const chartData = useMemo(() => {
    if (!txs) return [];
    const sorted = [...txs].filter((t) => t.status === 'SETTLED').reverse();
    let running = 0;
    return sorted.map((t, i) => {
      running += Number(t.amount);
      return { i: i + 1, cumulative: Math.round(running * 100) / 100, amount: Number(t.amount) };
    });
  }, [txs]);

  const settledCount = (txs || []).filter((t) => t.status === 'SETTLED').length;
  const rejectedCount = (txs || []).filter((t) => t.status === 'REJECTED').length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Devices online" value={`${online} / ${devices.length || 5}`} accent />
        <StatCard label="Packets in mesh" value={packetsInMesh} />
        <StatCard label="Idempotency cache" value={state?.idempotencyCacheSize ?? 0} />
        <StatCard label="Settled txns" value={settledCount} sub={`${rejectedCount} rejected`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-panel border border-panelborder rounded-xl p-5">
          <div className="text-xs font-mono text-sub uppercase mb-3">Cumulative settled volume</div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={chartData}>
                <CartesianGrid stroke="#1b2230" strokeDasharray="3 3" />
                <XAxis dataKey="i" tick={{ fill: '#7c8a9a', fontSize: 11 }} axisLine={{ stroke: '#1b2230' }} />
                <YAxis tick={{ fill: '#7c8a9a', fontSize: 11 }} axisLine={{ stroke: '#1b2230' }} />
                <Tooltip
                  contentStyle={{ background: '#0b0f14', border: '1px solid #1b2230', borderRadius: 8, fontSize: 12 }}
                  labelFormatter={(v) => `transaction #${v}`}
                  formatter={(value) => [`₹${value}`, 'cumulative']}
                />
                <Line type="monotone" dataKey="cumulative" stroke="#34e0a1" strokeWidth={2} dot={false} isAnimationActive />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-sm text-sub">
              No settled transactions yet — head to Mesh Topology and inject a payment.
            </div>
          )}
        </div>

        <div className="bg-panel border border-panelborder rounded-xl p-4">
          <div className="text-xs font-mono text-sub uppercase mb-3">Mesh snapshot</div>
          <PacketFlowCanvas devices={devices} />
        </div>
      </div>
    </div>
  );
}
