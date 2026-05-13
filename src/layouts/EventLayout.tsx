import { Outlet } from 'react-router-dom';

export default function EventLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-surface-highlight p-4 bg-surface-base text-center">
        <h1>Event Highlight Header</h1>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
    </div>
  );
}
