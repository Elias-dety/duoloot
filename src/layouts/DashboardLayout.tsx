import { Outlet } from 'react-router-dom';

export default function DashboardLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-content-primary md:flex-row">
      <aside className="border-b border-border bg-surface-card/70 p-4 md:w-64 md:border-b-0 md:border-r">
        <nav className="font-black text-brand-primary">Duo Loot</nav>
      </aside>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
