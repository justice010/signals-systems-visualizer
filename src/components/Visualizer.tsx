import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { getStrategy } from '../strategies';

const Visualizer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { chapterId } = useParams<{ chapterId: string }>();
  
  const activeModule = useAppStore((state) => state.activeModule);
  const params = useAppStore((state) => state.params);
  const updateParam = useAppStore((state) => state.updateParam);
  
  // Controls logic
  const renderControls = () => {
    if (chapterId === 'state-space') {
      return (
        <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-800 rounded-lg w-full max-w-5xl">
          <div className="flex items-center space-x-3">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">System Dynamics (Matrix A):</label>
            <div className="flex bg-gray-700 p-1 rounded-md">
              {(['stable_focus', 'center', 'saddle', 'unstable_node'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateParam('stateSpace' as any, 'dynamicsType', type as any)}
                  className={`px-3 py-1 text-xs rounded transition-all ${
                    params.stateSpace.dynamicsType === type 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {type.replace('_', ' ').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="text-xs text-gray-500 italic border-l border-gray-700 pl-4">
            Watch how eigenvalues shape the geometry of time.
          </div>
        </div>
      );
    }

    if (chapterId === 'z-domain') {
      return (
        <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-800 rounded-lg w-full max-w-5xl">
          {/* Radius Control */}
          <div className="flex-grow flex items-center space-x-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Radius r (Stability):</label>
            <input 
              type="range" min="0.1" max="1.5" step="0.01" 
              value={params.zDomain.poleRadius}
              onChange={(e) => updateParam('zDomain' as any, 'poleRadius', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer accent-blue-500"
            />
            <span className={`text-sm font-mono w-12 text-right ${params.zDomain.poleRadius > 1 ? 'text-red-400 font-bold' : 'text-blue-400'}`}>
              {params.zDomain.poleRadius.toFixed(2)}
            </span>
          </div>

          {/* Angle Control */}
          <div className="flex-grow flex items-center space-x-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Angle \u03B8 (Freq):</label>
            <input 
              type="range" min="0" max={Math.PI} step="0.05" 
              value={params.zDomain.poleAngle}
              onChange={(e) => updateParam('zDomain' as any, 'poleAngle', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer accent-purple-500"
            />
            <span className="text-sm font-mono text-purple-400 w-12 text-right">{params.zDomain.poleAngle.toFixed(2)}</span>
          </div>

          <div className="text-xs text-gray-500 italic border-l border-gray-700 pl-4">
            Radius &gt; 1 = Unstable!
          </div>
        </div>
      );
    }

    if (chapterId === 's-domain') {
      return (
        <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-800 rounded-lg w-full max-w-5xl">
          {/* Sigma Control */}
          <div className="flex-grow flex items-center space-x-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Real \u03C3 (Damping):</label>
            <input 
              type="range" min="-5" max="2" step="0.05" 
              value={params.sDomain.sigma}
              onChange={(e) => updateParam('sDomain' as any, 'sigma', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer accent-blue-500"
            />
            <span className={`text-sm font-mono w-12 text-right ${params.sDomain.sigma > 0 ? 'text-red-400 font-bold' : 'text-blue-400'}`}>
              {params.sDomain.sigma.toFixed(2)}
            </span>
          </div>

          {/* Omega Control */}
          <div className="flex-grow flex items-center space-x-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Imag j\u03C9 (Freq):</label>
            <input 
              type="range" min="0" max="10" step="0.1" 
              value={params.sDomain.omega}
              onChange={(e) => updateParam('sDomain' as any, 'omega', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer accent-purple-500"
            />
            <span className="text-sm font-mono text-purple-400 w-12 text-right">{params.sDomain.omega.toFixed(1)}</span>
          </div>

          <div className="text-xs text-gray-500 italic border-l border-gray-700 pl-4">
            Try moving \u03C3 &gt; 0 to see instability!
          </div>
        </div>
      );
    }

    if (chapterId === 'time-domain') {
      return (
        <div className="flex flex-wrap items-center gap-6 p-4 bg-gray-800 rounded-lg w-full max-w-5xl">
          {/* Signal x(t) Select */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Signal x(\u03C4):</label>
            <select 
              value={params.timeDomain.signalType}
              onChange={(e) => updateParam('timeDomain' as any, 'signalType', e.target.value as any)}
              className="bg-gray-700 text-blue-400 text-sm rounded px-2 py-1 outline-none border border-gray-600 focus:border-blue-500"
            >
              <option value="rect">Rect Pulse</option>
              <option value="step">Unit Step</option>
              <option value="tri">Triangle</option>
              <option value="sine">Sine Pulse</option>
            </select>
          </div>

          {/* System h(t) Select */}
          <div className="flex items-center space-x-2">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">System h(\u03C4):</label>
            <select 
              value={params.timeDomain.systemType}
              onChange={(e) => updateParam('timeDomain' as any, 'systemType', e.target.value as any)}
              className="bg-gray-700 text-green-400 text-sm rounded px-2 py-1 outline-none border border-gray-600 focus:border-green-500"
            >
              <option value="exp">Exp Decay</option>
              <option value="rect">Rect Pulse</option>
              <option value="step">Unit Step</option>
            </select>
          </div>

          {/* Timeline Slider */}
          <div className="flex-grow flex items-center space-x-4">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Time t:</label>
            <input 
              type="range" min="-5" max="10" step="0.1" 
              value={params.timeDomain.t}
              disabled={params.timeDomain.autoPlay}
              onChange={(e) => updateParam('timeDomain' as any, 't', parseFloat(e.target.value))}
              className={`flex-grow cursor-pointer ${params.timeDomain.autoPlay ? 'opacity-30' : ''}`}
            />
            <span className="text-sm font-mono text-white w-10 text-right">{params.timeDomain.t.toFixed(1)}</span>
          </div>

          {/* AutoPlay Checkbox */}
          <label className="flex items-center space-x-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={params.timeDomain.autoPlay}
              onChange={(e) => updateParam('timeDomain' as any, 'autoPlay', e.target.checked ? 1 : 0)}
              className="form-checkbox h-4 w-4 text-blue-600 rounded bg-gray-700 border-gray-600"
            />
            <span className="text-sm font-medium text-gray-300">Auto Play</span>
          </label>
        </div>
      );
    }

    if (chapterId !== 'fourier') return <div className="text-gray-500 italic">本章节暂无参数调节</div>;

    switch (activeModule) {
      case 1:
        return (
          <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg w-full max-w-2xl">
            <label className="text-sm font-semibold text-gray-200 shrink-0">谐波次数 N:</label>
            <input 
              type="range" min="1" max="50" step="2" value={params.mod1.N}
              onChange={(e) => updateParam(1, 'N', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer"
            />
            <span className="text-sm font-mono text-blue-400 w-8">{params.mod1.N}</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg w-full max-w-2xl">
            <label className="text-sm font-semibold text-gray-200 shrink-0">周期 T:</label>
            <input 
              type="range" min="2" max="20" step="0.5" value={params.mod2.T}
              onChange={(e) => updateParam(2, 'T', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer"
            />
            <span className="text-sm font-mono text-purple-400 w-8">{params.mod2.T}</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg w-full max-w-2xl">
            <label className="text-sm font-semibold text-gray-200 shrink-0">脉冲宽度尺度 a:</label>
            <input 
              type="range" min="0.2" max="5" step="0.1" value={params.mod3.a}
              onChange={(e) => updateParam(3, 'a', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer"
            />
            <span className="text-sm font-mono text-green-400 w-8">{params.mod3.a.toFixed(1)}</span>
          </div>
        );
      case 4:
        return (
          <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg w-full max-w-2xl">
            <label className="text-sm font-semibold text-gray-200 shrink-0">截止频率 Wc:</label>
            <input 
              type="range" min="1" max="20" step="1" value={params.mod4.Wc}
              onChange={(e) => updateParam(4, 'Wc', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer"
            />
            <span className="text-sm font-mono text-blue-400 w-8">{params.mod4.Wc}</span>
          </div>
        );
      case 5:
        return (
          <div className="flex items-center space-x-4 p-4 bg-gray-800 rounded-lg w-full max-w-2xl">
            <label className="text-sm font-semibold text-gray-200 shrink-0">抽样频率 fs:</label>
            <input 
              type="range" min="0.5" max="5.0" step="0.1" value={params.mod5.fs}
              onChange={(e) => updateParam(5, 'fs', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer"
            />
            <span className="text-sm font-mono text-red-400 w-8">{params.mod5.fs.toFixed(1)}</span>
          </div>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const strategy = getStrategy(chapterId);
    console.log('Visualizer chapterId:', chapterId, 'Found strategy:', !!strategy);

    const render = (time: number) => {
      const { width, height } = canvas;
      const t = time / 1000;
      
      // Clear background
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);

      if (strategy) {
        strategy.render(ctx, width, height, t, activeModule, params);
      } else {
        ctx.fillStyle = '#444';
        ctx.font = '20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("可视化引擎正在构建中...", width / 2, height / 2);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [chapterId, activeModule, params]);

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 overflow-hidden">
      <div className="h-20 border-b border-gray-700 p-2 flex justify-center items-center shrink-0">
        {renderControls()}
      </div>
      <div className="flex-grow relative">
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>
    </div>
  );
};

export default Visualizer;