import type { CanvasStrategy } from './index';
import type { ModuleId, ModuleParams } from '../types';
import { drawAxes } from '../utils/math';

export class FilterDesignStrategy implements CanvasStrategy {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _globalTime: number,
    _activeModule: ModuleId,
    params: ModuleParams
  ): void {
    const { filterType, filterOrder: N } = params.filterDesign;
    const halfH = height / 2;
    const originX = width / 2;
    const topOriginY = halfH / 2;

    const wc = 3.0; // Cutoff frequency
    const sScale = 50; 
    const wScaleX = 80;
    const hScaleY = 150;

    // --- 1. Top View: s-Plane (Poles) ---
    ctx.save();
    drawAxes(ctx, 0, width, halfH, "s-Plane: Filter Pole Distribution");

    // Geometric Shapes (Circle for Butterworth, Ellipse for Chebyshev)
    ctx.beginPath();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    if (filterType === 'butterworth') {
      ctx.arc(originX, topOriginY, wc * sScale, Math.PI / 2, 3 * Math.PI / 2);
    } else {
      // Chebyshev ellipse: poles are more squashed towards the jw axis
      const eccentricity = 0.4; // Squash factor for Chebyshev
      ctx.ellipse(originX, topOriginY, wc * sScale * eccentricity, wc * sScale, 0, Math.PI / 2, 3 * Math.PI / 2);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Calculate and Draw Poles
    const poles = [];
    for (let k = 0; k < N; k++) {
      const theta = Math.PI / 2 + ((2 * k + 1) * Math.PI) / (2 * N);
      let s_real, s_imag;
      
      if (filterType === 'butterworth') {
        s_real = wc * Math.cos(theta);
        s_imag = wc * Math.sin(theta);
      } else {
        const eccentricity = 0.4;
        s_real = wc * Math.cos(theta) * eccentricity;
        s_imag = wc * Math.sin(theta);
      }
      poles.push({ r: s_real, i: s_imag });
    }

    poles.forEach(p => {
      const px = originX + p.r * sScale;
      const py = topOriginY - p.i * sScale;
      const size = 6;
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px - size, py - size); ctx.lineTo(px + size, py + size);
      ctx.moveTo(px + size, py - size); ctx.lineTo(px - size, py + size);
      ctx.stroke();
    });

    ctx.fillStyle = filterType === 'butterworth' ? '#60a5fa' : '#fbbf24';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText(`${filterType.toUpperCase()} (N=${N})`, 20, 40);
    ctx.restore();

    // --- 2. Bottom View: Magnitude Response |H(jw)| ---
    ctx.save();
    ctx.translate(0, halfH);
    drawAxes(ctx, 0, width, halfH, "Magnitude Response |H(j\u03C9)|");

    const getH = (w: number) => {
      const x = Math.abs(w) / wc;
      if (filterType === 'butterworth') {
        return 1 / Math.sqrt(1 + Math.pow(x, 2 * N));
      } else {
        // Chebyshev Type I approximation
        // T_N(x) = cos(N * acos(x)) for x <= 1, cosh(N * acosh(x)) for x > 1
        const epsilon = 0.5; // Ripple factor
        let TN;
        if (x <= 1) {
          TN = Math.cos(N * Math.acos(x));
        } else {
          TN = Math.cosh(N * Math.log(x + Math.sqrt(x * x - 1)));
        }
        return 1 / Math.sqrt(1 + epsilon * epsilon * TN * TN);
      }
    };

    ctx.beginPath();
    ctx.strokeStyle = filterType === 'butterworth' ? '#60a5fa' : '#fbbf24';
    ctx.lineWidth = 3;
    for (let i = 0; i < width; i++) {
      const w = (i - originX) / wScaleX;
      const h = getH(w);
      const py = halfH - 40 - h * hScaleY;
      if (i === 0) ctx.moveTo(i, py);
      else ctx.lineTo(i, py);
    }
    ctx.stroke();

    // Visual indicators
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    const cutoffPx = originX + wc * wScaleX;
    ctx.beginPath();
    ctx.moveTo(cutoffPx, 0); ctx.lineTo(cutoffPx, halfH);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px sans-serif';
    ctx.fillText("Cutoff \u03C9c", cutoffPx + 5, halfH - 10);
    ctx.restore();
  }
}
