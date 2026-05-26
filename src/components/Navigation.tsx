import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const chapters = [
  { path: '/chapter/time-domain', label: '时域分析' },
  { path: '/chapter/vector-space', label: '矢量空间' },
  { path: '/chapter/fourier', label: '傅里叶变换' },
  { path: '/chapter/s-domain', label: 's 域分析 (Laplace)' },
  { path: '/chapter/z-domain', label: 'z 域分析' },
  { path: '/chapter/state-space', label: '状态空间' },
  { path: '/chapter/feedback', label: '反馈系统 (根轨迹)' },
  { path: '/chapter/filter-design', label: '滤波器设计' },
  { path: '/chapter/random-signals', label: '随机信号分析' },
];

const Navigation: React.FC = () => {
  return (
    <nav className="h-14 w-full bg-gray-800 border-b border-gray-700 flex items-center px-4 md:px-6 space-x-4 md:space-x-8 shrink-0 overflow-hidden">
      <Link 
        to="/" 
        className="text-lg md:text-xl font-bold text-blue-400 mr-2 md:mr-4 hover:text-blue-300 transition-colors cursor-pointer shrink-0"
      >
        <span className="hidden sm:inline">Signals &amp; Systems Visualizer</span>
        <span className="sm:hidden">SSV</span>
      </Link>
      
      <div className="flex space-x-4 md:space-x-6 overflow-x-auto no-scrollbar py-2 scroll-smooth">
        {chapters.map((ch) => (
          <NavLink
            key={ch.path}
            to={ch.path}
            className={({ isActive }) =>
              `text-xs md:text-sm font-medium transition-colors hover:text-white shrink-0 whitespace-nowrap py-1 ${
                isActive ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'
              }`
            }
          >
            {ch.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
