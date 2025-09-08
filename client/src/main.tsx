import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Homepage from './routes/Homepage';
import LoginPage from './routes/LoginPage';
import MainLayout from './layouts/MainLayout';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import NotFoundPage from './routes/NotFoundPage';
import {
  BlogListPage,
  SingleBlogPage,
  CreateBlogPage,
  EditBlogPage,
  preloadCriticalResources,
  trackWebVitals,
  registerServiceWorker,
} from './utils';

export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('Missing API URL');
}

axios.defaults.withCredentials = true;

// Loading component for Suspense
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2c586a]"></div>
  </div>
);

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h1 className="text-2xl font-bold text-[#2c586a]">
          Something went wrong
        </h1>
        <p className="text-gray-600">
          Please refresh the page or contact support
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#2c586a] text-white rounded hover:bg-[#2c586a]/90"
        >
          Refresh Page
        </button>
      </div>
    ),
    children: [
      {
        path: '/',
        element: <Homepage />,
      },
      {
        path: '/blogs',
        element: <BlogListPage />,
      },
      {
        path: '/blogs/create',
        element: <CreateBlogPage />,
      },
      {
        path: '/blogs/edit/:slug',
        element: <EditBlogPage />,
      },
      {
        path: '/blogs/:slug',
        element: <SingleBlogPage />,
      },
      // {
      //   path: '/news',
      //   element: <NewsListPage />,
      // },
      // {
      //   path: '/news/create',
      //   element: <CreateNewsPage />,
      // },
      // {
      //   path: '/news/edit/:slug',
      //   element: <EditNewsPage />,
      // },
      // {
      //   path: '/news/:slug',
      //   element: <SingleNewsPage />,
      // },
      {
        path: '/wisdom/2025/login',
        element: <LoginPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

// Initialize performance optimizations
const initializeApp = async () => {
  // Preload critical resources
  preloadCriticalResources();

  // Track web vitals
  trackWebVitals();

  // Register service worker in production
  if (import.meta.env.PROD) {
    await registerServiceWorker();
  }
};

initializeApp();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        toastClassName="font-medium"
      />
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);
