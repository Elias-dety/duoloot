import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-r border-zinc-800 p-4 md:w-64">
        <nav>Dashboard Sidebar</nav>
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
