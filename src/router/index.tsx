import { createBrowserRouter, Navigate } from 'react-router-dom';
import AppLayout from '../components/AppLayout';
import ChapterView from '../components/ChapterView';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/chapter/fourier" replace />,
      },
      {
        path: 'chapter/:chapterId',
        element: <ChapterView />,
      },
    ],
  },
]);

export default router;