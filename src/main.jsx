import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; 

import { router } from './router/router.jsx';
import { AuthProvider } from './hooks/AuthContext'; // ✅ Make sure this import exists
import { RouterProvider } from 'react-router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
