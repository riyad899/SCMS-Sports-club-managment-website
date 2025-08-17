import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

import { router } from './router/router.jsx';
import { AuthProvider } from './Component/hooks/AuthContext.jsx';
import { CouponsProvider } from './Component/Context/CouponsContext.jsx';
import { ThemeProvider } from './Component/Context/ThemeContext.jsx';
import { RouterProvider } from 'react-router';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Initialize React Query client
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CouponsProvider>
            <RouterProvider router={router} />
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
          </CouponsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
