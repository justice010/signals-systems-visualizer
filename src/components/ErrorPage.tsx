import React from 'react';
import { useRouteError, isRouteErrorResponse, Navigate } from 'react-router-dom';

const ErrorPage: React.FC = () => {
  const error = useRouteError();
  console.error('Route Error:', error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <Navigate to="/chapter/fourier" replace />;
  }

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-900 text-white p-10">
      <h1 className="text-4xl font-bold text-red-500 mb-4">Something went wrong</h1>
      <p className="text-gray-400 mb-6">
        {isRouteErrorResponse(error) 
          ? `${error.status} ${error.statusText}` 
          : error instanceof Error ? error.message : 'Unknown error'}
      </p>
      <button 
        onClick={() => window.location.href = '/'}
        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded transition-colors"
      >
        Return to Safety
      </button>
    </div>
  );
};

export default ErrorPage;