import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ChapterView from '../components/ChapterView';
import ErrorPage from '../components/ErrorPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'chapter/:chapterId',
        element: <ChapterView />,
      },
      {
        path: '',
        element: <Navigate to="/chapter/fourier" replace />,
      },
      {
        path: '*',
        element: <Navigate to="/chapter/fourier" replace />,
      }
    ],
  },
]);

export default router;