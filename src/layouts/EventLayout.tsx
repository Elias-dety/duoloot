import { Outlet } from 'react-router-dom';

export default function EventLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-content-primary">
      <header className="border-b border-prize/25 bg-surface-card p-4 text-center">
        <h1 className="font-black text-prize">Duo Loot Cofre</h1>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
