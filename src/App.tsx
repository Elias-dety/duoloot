import { ReactBricks } from 'react-bricks/frontend';
import { RouterProvider } from 'react-router-dom';
import { router } from '@/routes/router';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { reactBricksConfig } from '@/react-bricks-config';

export default function App() {
  return (
    <ReactBricks {...reactBricksConfig}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ReactBricks>
  );
}
