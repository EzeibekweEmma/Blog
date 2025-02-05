import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/Homepage';
import BlogListPage from './routes/BlogListPage';
import Write from './routes/crateBlog';
import LoginPage from './routes/LoginPage';
import RegisterPage from './routes/RegisterPage';
import SingleBlogPage from './routes/SingleBlogPage';
import MainLayout from './layouts/MainLayout';
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key');
}

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
        path: '/blogs/:slug',
        element: <SingleBlogPage />,
      },
      {
        path: '/saved',
        element: <div>Saved Blogs</div>,
      },
      {
        path: '/write',
        element: <Write />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
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
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>
);
