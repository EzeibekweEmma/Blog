import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Homepage from './routes/Homepage.tsx';
import BlogListPage from './routes/BlogListPage.tsx';
import Write from './routes/crateBlog.tsx';
import LoginPage from './routes/LoginPage.tsx';
import RegisterPage from './routes/RegisterPage.tsx';
import SingleBlogPage from './routes/SingleBlogPage.tsx';

const router = createBrowserRouter([
  {
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
        path: '/blog/:slug',
        element: <SingleBlogPage />,
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

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
