import React from 'react';
import { useNavigate } from 'react-router-dom';

const chapters = [
  { id: 'time-domain', title: '时域分析', desc: '卷积、冲激响应与系统演化' },
  { id: 'vector-space', title: '矢量空间', desc: '信号的正交投影与 Parseval 定理' },
  { id: 'fourier', title: '傅里叶变换', desc: '频域分解、谐波合成与吉布斯现象' },
  { id: 's-domain', title: 's 域分析 (Laplace)', desc: '复频域、零极点与系统稳定性' },
  { id: 'z-domain', title: 'z 域分析', desc: '离散序列、单位圆与数字系统' },
  { id: 'state-space', title: '状态空间', desc: '多维动态、相平面与特征值动力学' },
  { id: 'feedback', title: '反馈系统 (根轨迹)', desc: '闭环控制、根轨迹演化与性能优化' },
  { id: 'filter-design', title: '滤波器设计', desc: '巴特沃斯、切比雪夫与系统逼近' },
  { id: 'random-signals', title: '随机信号分析', desc: '噪声整形、功率谱密度与线性过滤' },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full overflow-y-auto bg-gray-900 text-gray-100 p-6 md:p-16 scroll-smooth">
      <header className="max-w-6xl mx-auto mb-10 md:mb-16 text-center">
        <h1 className="text-3xl md:text-6xl font-extrabold text-blue-400 mb-4 tracking-tight leading-tight">
          Signals & Systems Visualizer
        </h1>
        <p className="text-lg md:text-xl text-gray-400 font-medium">
          交互式信号与系统可视化学习平台
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
        {chapters.map((ch) => (
          <div
            key={ch.id}
            onClick={() => navigate(`/chapter/${ch.id}`)}
            className="group relative bg-gray-800 border border-gray-700 p-5 md:p-8 rounded-2xl cursor-pointer 
                       transition-all duration-500 hover:scale-[1.02] active:scale-95 hover:border-blue-500/50 
                       hover:shadow-[0_20px_50px_rgba(59,130,246,0.15)] overflow-hidden"
          >
            {/* Decorative background glow */}
            <div className="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors"></div>
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg md:text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">
                {ch.title}
              </h3>
              <div className="p-2 bg-gray-700/50 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
            
            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-light">
              {ch.desc}
            </p>
          </div>
        ))}
      </div>

      <footer className="max-w-6xl mx-auto mt-24 pb-12 border-t border-gray-800/50 pt-10 text-center">
        <p className="text-gray-500 text-sm tracking-widest">
          探索频域与时域的奥秘，让抽象的数学在几何流动中具象化。
        </p>
        <div className="mt-4 flex justify-center space-x-2">
           <div className="w-1 h-1 rounded-full bg-blue-500/30"></div>
           <div className="w-1 h-1 rounded-full bg-blue-500/30"></div>
           <div className="w-1 h-1 rounded-full bg-blue-500/30"></div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
