import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { router } from './router/router.jsx';
import { AuthProvider } from './Component//hooks/AuthContext.jsx'
import { RouterProvider } from 'react-router';
import { CouponsProvider } from './Component/Context/CouponsContext.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <CouponsProvider>
        <RouterProvider router={router} />
      </CouponsProvider>
    </AuthProvider>
  </StrictMode>
);

