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
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import EditBlogPage from './routes/EditBlogPage';

export const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error('Missing API URL');
}

axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    errorElement: (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <h1>Something went wrong.</h1>
        <p>Please refresh the page or contact support.</p>
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
        path: '/news',
        element: <div>news</div>,
      },
      {
        path: '/blogs/create',
        element: <CrateBlogPage />,
      },
      {
        path: '/blogs/edit/:slug',
        element: <EditBlogPage />,
      },
      {
        path: '/blogs/:slug',
        element: <SingleBlogPage />,
      },
      {
        path: '/wisdom/2025/login',
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
