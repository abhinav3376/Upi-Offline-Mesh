import { useMemo } from 'react';

const WIDTH = 640;
const HEIGHT = 420;
const CENTER = { x: WIDTH / 2 - 70, y: HEIGHT / 2 };
const RADIUS = 150;
const BACKEND = { x: WIDTH - 70, y: HEIGHT / 2 };

function layoutDevices(devices) {
  // Bridge (internet-enabled) node goes to the top, the rest fan out below
  // it in a circle — same visual grammar as the original dashboard.
  const bridge = devices.find((d) => d.hasInternet);
  const others = devices.filter((d) => !d.hasInternet);
  const positions = {};

  if (bridge) {
    positions[bridge.deviceId] = { x: CENTER.x, y: CENTER.y - RADIUS };
  }
  const n = others.length || 1;
  others.forEach((d, i) => {
    const angle = (Math.PI * 2 * i) / n + Math.PI / 2 + 0.4;
    positions[d.deviceId] = {
      x: CENTER.x + RADIUS * Math.cos(angle) * 0.95,
      y: CENTER.y + RADIUS * Math.sin(angle) * 0.6 + 40,
    };
  });
  return positions;
}

export default function PacketFlowCanvas({ devices, pulseDeviceId, gossiping, flushing }) {
  const positions = useMemo(() => layoutDevices(devices), [devices]);
  const bridge = devices.find((d) => d.hasInternet);

  const pairs = [];
  for (let i = 0; i < devices.length; i++) {
    for (let j = i + 1; j < devices.length; j++) {
      pairs.push([devices[i], devices[j]]);
    }
  }

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
      {/* faint mesh lines between every pair of devices */}
      {pairs.map(([a, b]) => {
        const pa = positions[a.deviceId];
        const pb = positions[b.deviceId];
        if (!pa || !pb) return null;
        return (
          <line
            key={`${a.deviceId}-${b.deviceId}`}
            x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y}
            stroke="#1b2230" strokeWidth="1"
            className={gossiping ? 'mesh-edge-active' : ''}
            strokeDasharray={gossiping ? '4 4' : undefined}
          />
        );
      })}

      {/* bridge -> backend link */}
      {bridge && positions[bridge.deviceId] && (
        <line
          x1={positions[bridge.deviceId].x}
          y1={positions[bridge.deviceId].y}
          x2={BACKEND.x}
          y2={BACKEND.y}
          stroke="#34e0a1"
          strokeWidth={flushing ? 2.5 : 1.5}
          strokeDasharray="6 6"
          className={flushing ? 'mesh-edge-active' : ''}
          opacity={flushing ? 1 : 0.5}
        />
      )}

      {/* traveling packet dot during a flush */}
      {flushing && bridge && positions[bridge.deviceId] && (
        <circle r="4" fill="#34e0a1">
          <animateMotion
            dur="0.9s"
            repeatCount="indefinite"
            path={`M${positions[bridge.deviceId].x},${positions[bridge.deviceId].y} L${BACKEND.x},${BACKEND.y}`}
          />
        </circle>
      )}

      {/* backend node */}
      <g transform={`translate(${BACKEND.x}, ${BACKEND.y})`}>
        <rect x="-26" y="-22" width="52" height="44" rx="10" fill="#0b0f14" stroke="#1b2230" strokeWidth="1.5" />
        <line x1="-14" y1="-8" x2="14" y2="-8" stroke="#7c8a9a" strokeWidth="2" />
        <line x1="-14" y1="0" x2="14" y2="0" stroke="#7c8a9a" strokeWidth="2" />
        <line x1="-14" y1="8" x2="6" y2="8" stroke="#7c8a9a" strokeWidth="2" />
        <text y="42" textAnchor="middle" className="fill-sub text-[11px] font-mono">backend</text>
      </g>

      {/* device nodes */}
      {devices.map((d) => {
        const pos = positions[d.deviceId];
        if (!pos) return null;
        const active = pulseDeviceId === d.deviceId;
        return (
          <g key={d.deviceId} transform={`translate(${pos.x}, ${pos.y})`}>
            {(active || (d.hasInternet && flushing)) && (
              <circle r="26" fill="none" stroke="#34e0a1" strokeWidth="2" className="pulse-ring" />
            )}
            <circle
              r="26"
              fill={d.hasInternet ? 'rgba(52,224,161,0.12)' : '#0b0f14'}
              stroke={d.hasInternet ? '#34e0a1' : '#1b2230'}
              strokeWidth="1.5"
            />
            <text textAnchor="middle" dy="6" className={`text-[15px] ${d.hasInternet ? 'fill-mint' : 'fill-ink'}`}>
              {d.hasInternet ? '↑' : '▯'}
            </text>
            {d.packetCount > 0 && (
              <g transform="translate(18, -18)">
                <circle r="9" fill="#05070a" stroke="#34e0a1" strokeWidth="1" />
                <text textAnchor="middle" dy="3.5" className="fill-mint text-[10px] font-mono">
                  {d.packetCount}
                </text>
              </g>
            )}
            <text y="42" textAnchor="middle" className="fill-sub text-[11px] font-mono">
              {d.deviceId.replace('phone-', '')}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
