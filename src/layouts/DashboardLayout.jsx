import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx';
import Header from '../components/Header.jsx';

const TITLES = {
  '/dashboard': { title: 'Overview', subtitle: 'Live mesh status at a glance' },
  '/dashboard/mesh': { title: 'Mesh Topology', subtitle: 'Devices, packets, and gossip in real time' },
  '/dashboard/transactions': { title: 'Transactions', subtitle: 'Settled and rejected packets, most recent first' },
  '/dashboard/accounts': { title: 'Accounts', subtitle: 'Demo balances used for settlement' },
};

export default function DashboardLayout() {
  const location = useLocation();
  const { title, subtitle } = TITLES[location.pathname] || TITLES['/dashboard'];

  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
