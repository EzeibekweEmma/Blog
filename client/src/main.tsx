import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/Homepage';
import BlogListPage from './routes/BlogListPage';
import CreateBlogPage from './routes/CreateBlogPage';
import LoginPage from './routes/LoginPage';
import SingleBlogPage from './routes/SingleBlogPage';
import MainLayout from './layouts/MainLayout';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';
import EditBlogPage from './routes/EditBlogPage';
import NewsListPage from './routes/NewsListPage';
import CreateNewsPage from './routes/CreateNewsPage';
import EditNewsPage from './routes/EditNewsPage';
import SingleNewsPage from './routes/SingleNewsPage';
import NotFoundPage from './routes/NotFoundPage';

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
      {
        path: '/news',
        element: <NewsListPage />,
      },
      {
        path: '/news/create',
        element: <CreateNewsPage />,
      },
      {
        path: '/news/edit/:slug',
        element: <EditNewsPage />,
      },
      {
        path: '/news/:slug',
        element: <SingleNewsPage />,
      },
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ToastContainer />
    <RouterProvider router={router} />
  </StrictMode>
);
