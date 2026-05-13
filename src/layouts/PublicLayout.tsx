import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-content-primary">
      <header className="border-b border-border bg-surface-card/70 p-4">
        <h1 className="font-black text-brand-primary">Duo Loot</h1>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="border-t border-border p-4 text-content-muted">
        <p>Duo Loot MVP</p>
      </footer>
    </div>
  );
}
