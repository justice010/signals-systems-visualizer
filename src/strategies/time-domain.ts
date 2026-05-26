import type { CanvasStrategy } from './index';
import type { ModuleId, ModuleParams } from '../types';
import { drawAxes } from '../utils/math';

export class TimeDomainStrategy implements CanvasStrategy {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    globalTime: number,
    _activeModule: ModuleId,
    params: ModuleParams
  ): void {
    const { signalType, systemType, t: manualT, autoPlay } = params.timeDomain;
    
    // Determine current time 't'
    let t = manualT;
    if (autoPlay) {
      // Loop from -5 to 10
      const duration = 15;
      const speed = 1.0;
      t = ((globalTime * speed) % duration) - 5;
    }

    const halfH = height / 2;
    const originX = width / 2;
    const topOriginY = halfH / 2 + 40; // Offset down for labels
    const bottomOriginY = halfH + halfH / 2 + 20;
    const scaleX = 50; // pixels per unit time
    const scaleY = 60; // pixels per unit amplitude

    // Draw Background & Axes
    drawAxes(ctx, 40, width, halfH - 40, "Dynamic Process: x(\u03C4) and h(t-\u03C4)");
    drawAxes(ctx, halfH, width, halfH, "Convolution Result: y(t)");

    // Signal Definitions
    const getX = (tau: number) => {
      switch (signalType) {
        case 'rect': return (tau >= 0 && tau <= 2) ? 1 : 0;
        case 'step': return (tau >= 0) ? 1 : 0;
        case 'tri': return (tau >= 0 && tau <= 2) ? (1 - Math.abs(tau - 1)) : 0;
        case 'sine': return (tau >= 0 && tau <= Math.PI) ? Math.sin(tau) : 0;
        default: return 0;
      }
    };

    const getH = (tau: number) => {
      switch (systemType) {
        case 'exp': return (tau >= 0) ? Math.exp(-0.8 * tau) : 0;
        case 'rect': return (tau >= 0 && tau <= 1.5) ? 1 : 0;
        case 'step': return (tau >= 0) ? 0.8 : 0;
        default: return 0;
      }
    };

    // h(t - tau)
    const getHTauShifted = (tau: number) => getH(t - tau);

    // --- 1. Upper View: x(tau) and h(t-tau) ---
    ctx.save();
    
    // Draw x(tau) - Blue
    ctx.beginPath();
    ctx.strokeStyle = '#60a5fa';
    ctx.fillStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i++) {
      const tau = (i - originX) / scaleX;
      const val = getX(tau);
      if (i === 0) ctx.moveTo(i, topOriginY - val * scaleY);
      else ctx.lineTo(i, topOriginY - val * scaleY);
    }
    ctx.stroke();
    // Fill to axis
    ctx.lineTo(width, topOriginY);
    ctx.lineTo(0, topOriginY);
    ctx.fill();

    // Draw h(t - tau) - Green
    ctx.beginPath();
    ctx.strokeStyle = '#34d399';
    ctx.fillStyle = 'rgba(52, 211, 153, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < width; i++) {
      const tau = (i - originX) / scaleX;
      const val = getHTauShifted(tau);
      if (i === 0) ctx.moveTo(i, topOriginY - val * scaleY);
      else ctx.lineTo(i, topOriginY - val * scaleY);
    }
    ctx.stroke();
    ctx.lineTo(width, topOriginY);
    ctx.lineTo(0, topOriginY);
    ctx.fill();

    // Draw Overlap - Yellow/Red
    let overlapArea = 0;
    
    // Correct overlap drawing logic: build a path for points where overlap > 0
    ctx.beginPath();
    ctx.fillStyle = 'rgba(251, 191, 36, 0.6)'; // Amber-400
    ctx.strokeStyle = '#fbbf24';
    let inOverlap = false;
    for (let i = 0; i < width; i++) {
      const tau = (i - originX) / scaleX;
      const valX = getX(tau);
      const valH = getHTauShifted(tau);
      const val = valX * valH;
      
      if (val > 0) {
        if (!inOverlap) {
          ctx.moveTo(i, topOriginY);
          inOverlap = true;
        }
        ctx.lineTo(i, topOriginY - val * scaleY);
        overlapArea += val * (1 / scaleX);
      } else if (inOverlap) {
        ctx.lineTo(i, topOriginY);
        inOverlap = false;
      }
    }
    if (inOverlap) ctx.lineTo(width, topOriginY);
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // --- 2. Lower View: y(t) ---
    ctx.save();
    
    const getY = (timePoint: number) => {
      let sum = 0;
      const start = -5;
      const end = 10;
      const step = 0.02;
      for (let tau = start; tau <= end; tau += step) {
        sum += getX(tau) * getH(timePoint - tau) * step;
      }
      return sum;
    };

    // Draw y(t) curve up to current t
    ctx.beginPath();
    ctx.strokeStyle = '#f43f5e'; // Rose-500
    ctx.lineWidth = 3;
    
    for (let it = 0; it < width; it++) {
      const currT = (it - originX) / scaleX;
      if (currT > t) break;
      const valY = getY(currT);
      if (it === 0) ctx.moveTo(it, bottomOriginY - valY * scaleY);
      else ctx.lineTo(it, bottomOriginY - valY * scaleY);
    }
    ctx.stroke();

    // Draw indicator dot
    const dotX = originX + t * scaleX;
    const dotY = bottomOriginY - getY(t) * scaleY;
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(dotX, dotY, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText(`Current t = ${t.toFixed(2)}`, width - 150, 30);
    ctx.fillText(`Overlap Area (y(t)) = ${overlapArea.toFixed(3)}`, width - 220, 60);

    ctx.restore();
  }
}