import { Outlet } from 'react-router-dom';
import { Card } from '@/components/atoms';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card variant="elevated" className="w-full max-w-md">
        <Outlet />
      </Card>
    </div>
  );
}
