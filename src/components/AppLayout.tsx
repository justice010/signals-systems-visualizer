import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from './Navigation';

const AppLayout: React.FC = () => {
  return (
    <div 
      className="h-screen w-screen flex flex-col bg-gray-900 text-gray-100 overflow-hidden"
      style={{ backgroundColor: '#111827' }}
    >
      <Navigation />
      <div className="flex-grow overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;