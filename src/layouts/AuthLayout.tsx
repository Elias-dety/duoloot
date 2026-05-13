import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md border border-zinc-800 rounded-lg p-6">
        <Outlet />
      </div>
    </div>
  );
}
