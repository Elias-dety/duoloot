import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-zinc-800 p-4">
        <h1>Public Header</h1>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="border-t border-zinc-800 p-4">
        <p>Public Footer</p>
      </footer>
    </div>
  );
}
