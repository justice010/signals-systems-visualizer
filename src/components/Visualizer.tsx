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
  
  const renderControls = () => {
    if (!params) return null;

    if (chapterId === 'random-signals' && params.randomSignals) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 p-1 md:p-4 w-full max-w-5xl mx-auto">
          <div className="flex items-center space-x-1 md:space-x-4">
            <label className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Noise:</label>
            <input 
              type="range" min="1" max="10" step="0.5" 
              value={params.randomSignals.noiseIntensity}
              onChange={(e) => updateParam('randomSignals', 'noiseIntensity', parseFloat(e.target.value))}
              className="w-16 md:w-32 cursor-pointer accent-gray-400 h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-gray-300 w-5 md:w-8">{params.randomSignals.noiseIntensity}</span>
          </div>

          <div className="flex flex-grow items-center space-x-1 md:space-x-4 border-l border-gray-700 pl-1 md:pl-4">
            <label className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">BW:</label>
            <input 
              type="range" min="1" max="20" step="0.5" 
              value={params.randomSignals.systemBandwidth}
              onChange={(e) => updateParam('randomSignals', 'systemBandwidth', parseFloat(e.target.value))}
              className="flex-grow min-w-[60px] cursor-pointer accent-green-500 h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-green-400 w-6 md:w-10 text-right">{params.randomSignals.systemBandwidth}</span>
          </div>
        </div>
      );
    }

    if (chapterId === 'filter-design' && params.filterDesign) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 p-1 md:p-4 w-full max-w-5xl mx-auto">
          <div className="flex items-center space-x-1">
            <div className="flex bg-gray-700 p-0.5 rounded-md">
              {(['butterworth', 'chebyshev'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => updateParam('filterDesign', 'filterType', type)}
                  className={`px-1.5 md:px-3 py-0.5 md:py-1 text-[9px] md:text-xs rounded transition-all ${
                    params.filterDesign.filterType === type 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {type === 'butterworth' ? 'BUTTER' : 'CHEBY'}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-grow items-center space-x-1 md:space-x-4 border-l border-gray-700 pl-1 md:pl-4">
            <label className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">N:</label>
            <input 
              type="range" min="1" max="8" step="1" 
              value={params.filterDesign.filterOrder}
              onChange={(e) => updateParam('filterDesign', 'filterOrder', parseInt(e.target.value))}
              className="flex-grow min-w-[60px] cursor-pointer accent-blue-500 h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-blue-400 w-3 md:w-8 text-right">{params.filterDesign.filterOrder}</span>
          </div>
        </div>
      );
    }

    if (chapterId === 'feedback' && params.feedback) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 p-1 md:p-4 w-full max-w-5xl mx-auto">
          <div className="flex flex-grow items-center space-x-1 md:space-x-4">
            <label className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Gain K:</label>
            <input 
              type="range" min="0" max="20" step="0.1" 
              value={params.feedback.feedbackGain}
              onChange={(e) => updateParam('feedback', 'feedbackGain', parseFloat(e.target.value))}
              className="flex-grow min-w-[100px] cursor-pointer accent-red-500 h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-red-400 w-7 md:w-12 text-right">{params.feedback.feedbackGain.toFixed(1)}</span>
          </div>
        </div>
      );
    }

    if (chapterId === 'state-space' && params.stateSpace) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-6 p-1 md:p-4 w-full max-w-5xl mx-auto">
          <div className="flex bg-gray-700 p-0.5 rounded-md gap-0.5">
            {(['stable_focus', 'center', 'saddle', 'unstable_node'] as const).map((type) => (
              <button
                key={type}
                onClick={() => updateParam('stateSpace', 'dynamicsType', type)}
                className={`px-1.5 md:px-2 py-0.5 md:py-1 text-[8px] md:text-xs rounded transition-all whitespace-nowrap ${
                  params.stateSpace.dynamicsType === type 
                    ? 'bg-blue-600 text-white shadow-lg' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {type.split('_')[0].toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      );
    }

    if (chapterId === 'z-domain' && params.zDomain) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 p-1 md:p-4 w-full max-w-5xl mx-auto">
          <div className="flex flex-grow items-center space-x-1 md:space-x-4">
            <label className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">r:</label>
            <input 
              type="range" min="0.1" max="1.5" step="0.01" 
              value={params.zDomain.poleRadius}
              onChange={(e) => updateParam('zDomain', 'poleRadius', parseFloat(e.target.value))}
              className="flex-grow min-w-[50px] cursor-pointer accent-blue-500 h-2"
            />
            <span className={`text-[9px] md:text-sm font-mono w-7 md:w-12 text-right ${params.zDomain.poleRadius > 1 ? 'text-red-400 font-bold' : 'text-blue-400'}`}>
              {params.zDomain.poleRadius.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-grow items-center space-x-1 md:space-x-4 border-l border-gray-700 pl-1 md:pl-4">
            <label className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">\u03B8:</label>
            <input 
              type="range" min="0" max={Math.PI} step="0.05" 
              value={params.zDomain.poleAngle}
              onChange={(e) => updateParam('zDomain', 'poleAngle', parseFloat(e.target.value))}
              className="flex-grow min-w-[50px] cursor-pointer accent-purple-500 h-2"
            />
            <span className="text-[9px] md:text-sm font-mono text-purple-400 w-7 md:w-12 text-right">{params.zDomain.poleAngle.toFixed(2)}</span>
          </div>
        </div>
      );
    }

    if (chapterId === 's-domain' && params.sDomain) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 p-1 md:p-4 w-full max-w-5xl mx-auto">
          <div className="flex flex-grow items-center space-x-1 md:space-x-4">
            <label className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">\u03C3:</label>
            <input 
              type="range" min="-5" max="2" step="0.05" 
              value={params.sDomain.sigma}
              onChange={(e) => updateParam('sDomain', 'sigma', parseFloat(e.target.value))}
              className="flex-grow min-w-[50px] cursor-pointer accent-blue-500 h-2"
            />
            <span className={`text-[9px] md:text-sm font-mono w-7 md:w-12 text-right ${params.sDomain.sigma > 0 ? 'text-red-400 font-bold' : 'text-blue-400'}`}>
              {params.sDomain.sigma.toFixed(2)}
            </span>
          </div>
          <div className="flex flex-grow items-center space-x-1 md:space-x-4 border-l border-gray-700 pl-1 md:pl-4">
            <label className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">\u03C9:</label>
            <input 
              type="range" min="0" max="10" step="0.1" 
              value={params.sDomain.omega}
              onChange={(e) => updateParam('sDomain', 'omega', parseFloat(e.target.value))}
              className="flex-grow min-w-[50px] cursor-pointer accent-purple-500 h-2"
            />
            <span className="text-[9px] md:text-sm font-mono text-purple-400 w-7 md:w-12 text-right">{params.sDomain.omega.toFixed(1)}</span>
          </div>
        </div>
      );
    }

    if (chapterId === 'vector-space' && params.vectorSpace) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-6 p-1 md:p-4 w-full max-w-5xl mx-auto">
          <div className="flex flex-grow items-center space-x-1 md:space-x-4">
            <label className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">Axes:</label>
            <input 
              type="range" min="1" max="15" step="1" 
              value={params.vectorSpace.projectionAxes}
              onChange={(e) => updateParam('vectorSpace', 'projectionAxes', parseInt(e.target.value))}
              className="flex-grow min-w-[100px] cursor-pointer accent-blue-500 h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-blue-400 w-4 md:w-12 text-right">{params.vectorSpace.projectionAxes}</span>
          </div>
        </div>
      );
    }

    if (chapterId === 'time-domain' && params.timeDomain) {
      return (
        <div className="flex flex-wrap items-center justify-center gap-1 md:gap-4 p-1 md:p-4 w-full max-w-5xl mx-auto">
          <div className="flex items-center space-x-0.5 md:space-x-1">
            <select 
              value={params.timeDomain.signalType}
              onChange={(e) => updateParam('timeDomain', 'signalType', e.target.value)}
              className="bg-gray-700 text-blue-400 text-[8px] md:text-sm rounded px-0.5 md:px-2 py-0.5 outline-none border border-gray-600"
            >
              <option value="rect">x:Rec</option>
              <option value="step">x:Stp</option>
              <option value="tri">x:Tri</option>
              <option value="sine">x:Sin</option>
            </select>
            <select 
              value={params.timeDomain.systemType}
              onChange={(e) => updateParam('timeDomain', 'systemType', e.target.value)}
              className="bg-gray-700 text-green-400 text-[8px] md:text-sm rounded px-0.5 md:px-2 py-0.5 outline-none border border-gray-600"
            >
              <option value="exp">h:Exp</option>
              <option value="rect">h:Rec</option>
              <option value="step">h:Stp</option>
            </select>
          </div>
          <div className="flex flex-grow items-center space-x-1 md:space-x-4">
            <input 
              type="range" min="-5" max="10" step="0.1" 
              value={params.timeDomain.t}
              disabled={params.timeDomain.autoPlay}
              onChange={(e) => updateParam('timeDomain', 't', parseFloat(e.target.value))}
              className={`flex-grow min-w-[40px] cursor-pointer h-2 ${params.timeDomain.autoPlay ? 'opacity-30' : ''}`}
            />
            <span className="text-[9px] md:text-sm font-mono text-white w-5 md:w-10 text-right">{params.timeDomain.t.toFixed(1)}</span>
          </div>
          <label className="flex items-center space-x-0.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={params.timeDomain.autoPlay}
              onChange={(e) => updateParam('timeDomain', 'autoPlay', e.target.checked)}
              className="form-checkbox h-2.5 w-2.5 md:h-4 md:w-4 text-blue-600 rounded bg-gray-700 border-gray-600"
            />
            <span className="text-[8px] md:text-sm font-medium text-gray-300 whitespace-nowrap">Auto</span>
          </label>
        </div>
      );
    }

    if (chapterId !== 'fourier') return <div className="text-gray-500 italic text-center w-full text-[10px]">本章节暂无参数调节</div>;

    const modKey = (typeof activeModule === 'number' && activeModule <= 5 ? `mod${activeModule}` : activeModule) as keyof typeof params;
    const modParams = params[modKey] as any;
    if (!modParams) return null;

    switch (activeModule) {
      case 1:
        return (
          <div className="flex items-center justify-center space-x-2 md:space-x-4 p-1 md:p-4 w-full max-w-2xl mx-auto">
            <label className="text-[10px] md:text-sm font-semibold text-gray-200 shrink-0">N:</label>
            <input 
              type="range" min="1" max="50" step="2" value={modParams.N}
              onChange={(e) => updateParam(1, 'N', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-blue-400 w-5 md:w-8">{modParams.N}</span>
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center space-x-2 md:space-x-4 p-1 md:p-4 w-full max-w-2xl mx-auto">
            <label className="text-[10px] md:text-sm font-semibold text-gray-200 shrink-0">T:</label>
            <input 
              type="range" min="2" max="20" step="0.5" value={modParams.T}
              onChange={(e) => updateParam(2, 'T', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-purple-400 w-5 md:w-8">{modParams.T}</span>
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center space-x-2 md:space-x-4 p-1 md:p-4 w-full max-w-2xl mx-auto">
            <label className="text-[10px] md:text-sm font-semibold text-gray-200 shrink-0">a:</label>
            <input 
              type="range" min="0.2" max="5" step="0.1" value={modParams.a}
              onChange={(e) => updateParam(3, 'a', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-green-400 w-5 md:w-8">{modParams.a?.toFixed(1)}</span>
          </div>
        );
      case 4:
        return (
          <div className="flex items-center justify-center space-x-2 md:space-x-4 p-1 md:p-4 w-full max-w-2xl mx-auto">
            <label className="text-[10px] md:text-sm font-semibold text-gray-200 shrink-0">Wc:</label>
            <input 
              type="range" min="1" max="20" step="1" value={modParams.Wc}
              onChange={(e) => updateParam(4, 'Wc', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-blue-400 w-5 md:w-8">{modParams.Wc}</span>
          </div>
        );
      case 5:
        return (
          <div className="flex items-center justify-center space-x-2 md:space-x-4 p-1 md:p-4 w-full max-w-2xl mx-auto">
            <label className="text-[10px] md:text-sm font-semibold text-gray-200 shrink-0">fs:</label>
            <input 
              type="range" min="0.5" max="5.0" step="0.1" value={modParams.fs}
              onChange={(e) => updateParam(5, 'fs', parseFloat(e.target.value))}
              className="flex-grow cursor-pointer h-2"
            />
            <span className="text-[10px] md:text-sm font-mono text-red-400 w-5 md:w-8">{modParams.fs?.toFixed(1)}</span>
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

    const render = (time: number) => {
      const { width, height } = canvas;
      const t = time / 1000;
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, width, height);

      if (strategy && params) {
        try {
          strategy.render(ctx, width, height, t, activeModule, params);
        } catch (err) {
          console.error('Render error:', err);
        }
      } else {
        ctx.fillStyle = '#444';
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText("可视化引擎加载中...", width / 2, height / 2);
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
    <div className="flex flex-col h-full w-full bg-gray-900 overflow-hidden relative border-t md:border-t-0 md:border-l border-gray-800">
      {/* Mobile-optimized Control Bar */}
      <div className="min-h-[3rem] md:min-h-[5rem] h-auto border-b border-gray-700 p-1 md:p-2 flex justify-center items-center shrink-0 relative z-20 overflow-visible bg-gray-900/80 backdrop-blur-md">
        {renderControls()}
      </div>
      <div className="flex-grow relative overflow-hidden z-10">
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />
      </div>
    </div>
  );
};

export default Visualizer;
