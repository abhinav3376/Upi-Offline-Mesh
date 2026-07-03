import { useState } from 'react';
import { meshApi } from '../api/client.js';
import { usePolling } from '../hooks/usePolling.js';
import PacketFlowCanvas from '../components/PacketFlowCanvas.jsx';

const DEVICE_OPTIONS = ['phone-alice', 'phone-stranger1', 'phone-stranger2', 'phone-stranger3'];

export default function MeshTopology() {
  const { data: state } = usePolling(() => meshApi.state(), 1500);
  const [senderVpa, setSenderVpa] = useState('alice@demo');
  const [receiverVpa, setReceiverVpa] = useState('bob@demo');
  const [amount, setAmount] = useState('500');
  const [pin, setPin] = useState('1234');
  const [startDevice, setStartDevice] = useState('phone-alice');

  const [pulseDeviceId, setPulseDeviceId] = useState(null);
  const [gossiping, setGossiping] = useState(false);
  const [flushing, setFlushing] = useState(false);
  const [log, setLog] = useState([]);
  const [busy, setBusy] = useState(false);

  const pushLog = (line) => setLog((l) => [{ line, at: new Date() }, ...l].slice(0, 12));

  const runAction = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch (err) {
      pushLog(`✕ ${err.message}`);
    } finally {
      setBusy(false);
    }
  };

  const inject = () =>
    runAction(async () => {
      const res = await meshApi.demoSend({
        senderVpa, receiverVpa, amount: Number(amount), pin, ttl: 5, startDevice,
      });
      setPulseDeviceId(startDevice);
      setTimeout(() => setPulseDeviceId(null), 1600);
      pushLog(`→ injected packet ${res.packetId.slice(0, 8)}… at ${startDevice}`);
    });

  const gossip = () =>
    runAction(async () => {
      setGossiping(true);
      const res = await meshApi.gossip();
      pushLog(`⇄ gossip round: ${res.transfers} transfer(s)`);
      setTimeout(() => setGossiping(false), 1200);
    });

  const flush = () =>
    runAction(async () => {
      setFlushing(true);
      const res = await meshApi.flush();
      res.results.forEach((r) =>
        pushLog(`⬆ ${r.bridgeNode} → ${r.outcome}${r.reason ? ` (${r.reason})` : ''}`)
      );
      setTimeout(() => setFlushing(false), 1400);
    });

  const reset = () =>
    runAction(async () => {
      await meshApi.reset();
      pushLog('reset mesh + idempotency cache');
    });

  const devices = state?.devices || [];

  return (
    <div className="space-y-6">
      <div className="bg-panel border border-panelborder rounded-xl p-5">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-1">
            <label className="block text-xs font-mono text-sub mb-1.5">sender</label>
            <input
              className="w-full bg-bg border border-panelborder rounded-lg px-3 py-2 text-sm"
              value={senderVpa}
              onChange={(e) => setSenderVpa(e.target.value)}
            />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-xs font-mono text-sub mb-1.5">receiver</label>
            <input
              className="w-full bg-bg border border-panelborder rounded-lg px-3 py-2 text-sm"
              value={receiverVpa}
              onChange={(e) => setReceiverVpa(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-sub mb-1.5">amount ₹</label>
            <input
              className="w-full bg-bg border border-panelborder rounded-lg px-3 py-2 text-sm"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-sub mb-1.5">pin</label>
            <input
              className="w-full bg-bg border border-panelborder rounded-lg px-3 py-2 text-sm"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-sub mb-1.5">start device</label>
            <select
              className="w-full bg-bg border border-panelborder rounded-lg px-3 py-2 text-sm"
              value={startDevice}
              onChange={(e) => setStartDevice(e.target.value)}
            >
              {DEVICE_OPTIONS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-4">
          <button disabled={busy} onClick={inject} className="px-4 py-2 rounded-lg bg-mint text-bg text-sm font-semibold disabled:opacity-50">
            Inject into mesh
          </button>
          <button disabled={busy} onClick={gossip} className="px-4 py-2 rounded-lg border border-panelborder text-sm font-medium hover:border-mint/50 disabled:opacity-50">
            Run gossip round
          </button>
          <button disabled={busy} onClick={flush} className="px-4 py-2 rounded-lg border border-panelborder text-sm font-medium hover:border-mint/50 disabled:opacity-50">
            Bridges upload to backend
          </button>
          <button disabled={busy} onClick={reset} className="px-4 py-2 rounded-lg border border-rose-500/30 text-sm font-medium text-rose-400 hover:bg-rose-500/10 disabled:opacity-50">
            Reset mesh + cache
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-panel border border-panelborder rounded-xl p-4">
          <PacketFlowCanvas
            devices={devices}
            pulseDeviceId={pulseDeviceId}
            gossiping={gossiping}
            flushing={flushing}
          />
        </div>

        <div className="bg-panel border border-panelborder rounded-xl p-4 flex flex-col">
          <div className="text-xs font-mono text-sub uppercase mb-3">Activity log</div>
          <div className="flex-1 space-y-2 overflow-y-auto max-h-96">
            {log.length === 0 && (
              <p className="text-sm text-sub">No activity yet — inject a packet and gossip it around.</p>
            )}
            {log.map((entry, i) => (
              <div key={i} className="text-xs font-mono text-ink/90 border-b border-panelborder/60 pb-2">
                <span className="text-sub">{entry.at.toLocaleTimeString()}</span> {entry.line}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
