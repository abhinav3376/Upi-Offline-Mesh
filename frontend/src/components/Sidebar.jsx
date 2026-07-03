import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Overview', icon: '◈', end: true },
  { to: '/dashboard/mesh', label: 'Mesh Topology', icon: '⌘' },
  { to: '/dashboard/transactions', label: 'Transactions', icon: '≡' },
  { to: '/dashboard/accounts', label: 'Accounts', icon: '▤' },
];

export default function Sidebar() {
  return (
    <aside className="w-60 shrink-0 border-r border-panelborder bg-panel/60 flex flex-col">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-panelborder">
        <div className="w-8 h-8 rounded-lg bg-mint/10 border border-mint/30 flex items-center justify-center text-mint text-sm">
          ✳
        </div>
        <span className="font-mono font-semibold text-sm">UPI Offline Mesh</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-mint/10 text-mint border border-mint/20'
                  : 'text-sub hover:text-ink hover:bg-white/5 border border-transparent'
              }`
            }
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-panelborder text-xs text-sub font-mono">
        RSA-2048 · AES-256-GCM
        <br />
        hybrid encryption, per packet
      </div>
    </aside>
  );
}
