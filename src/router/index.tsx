import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ChapterView from '../components/ChapterView';
import ErrorPage from '../components/ErrorPage';
import HomePage from '../components/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'chapter/:chapterId',
        element: <ChapterView />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      }
    ],
  },
], {
  basename: '/signals-systems-visualizer'
});

export default router;
