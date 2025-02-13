import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/Homepage';
import BlogListPage from './routes/BlogListPage';
import CrateBlogPage from './routes/crateBlogPage';
import LoginPage from './routes/LoginPage';
import SingleBlogPage from './routes/SingleBlogPage';
import MainLayout from './layouts/MainLayout';
import { ToastContainer } from 'react-toastify';

// const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// if (!PUBLISHABLE_KEY) {
//   throw new Error('Missing Publishable Key');
// }

const router = createBrowserRouter([
  {
    element: <MainLayout />,
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
        path: '/blogs/saved',
        element: <div>Saved Blogs</div>,
      },
      {
        path: '/blogs/create',
        element: <CrateBlogPage />,
      },
      {
        path: '/blogs/:slug',
        element: <SingleBlogPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </StrictMode>
);
