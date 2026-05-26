import type { CanvasStrategy } from './index';
import type { ModuleId, ModuleParams } from '../types';
import { drawAxes, drawSignal, sinc } from '../utils/math';

export class FourierStrategy implements CanvasStrategy {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    t: number,
    activeModule: ModuleId,
    params: ModuleParams
  ): void {
    const halfH = height / 2;
    const originX = width / 2;
    const timeOriginY = halfH / 2;
    const freqOriginY = halfH + halfH / 2;

    // Draw Grid & Axes
    drawAxes(ctx, 0, width, halfH, "Time Domain");
    drawAxes(ctx, halfH, width, halfH, "Frequency Domain");

    const drawFreqLines = (lines: {x: number, h: number}[], color: string, scaleX: number, scaleY: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      lines.forEach(line => {
        const px = originX + line.x * scaleX;
        ctx.beginPath();
        ctx.moveTo(px, freqOriginY);
        ctx.lineTo(px, freqOriginY - line.h * scaleY);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(px, freqOriginY - line.h * scaleY, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawContinuousFreq = (fn: (w: number) => number, color: string, scaleX: number, scaleY: number) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      for (let i = 0; i < width; i++) {
        const w = (i - originX) / scaleX;
        const y = fn(w);
        if (i === 0) ctx.moveTo(i, freqOriginY - y * scaleY);
        else ctx.lineTo(i, freqOriginY - y * scaleY);
      }
      ctx.stroke();
    };

    // Mod1: Gibbs
    if (activeModule === 1) {
      const N = params.mod1.N;
      const speed = 2;
      drawSignal(ctx, (x) => {
        let sum = 0;
        for (let k = 1; k <= N; k += 2) {
          sum += (1 / k) * Math.sin(k * (x - t * speed));
        }
        return sum;
      }, originX, timeOriginY, width, 40, 60, '#60a5fa');

      const lines = [];
      for (let k = 1; k <= N; k += 2) {
        lines.push({ x: k, h: 1 / k });
        lines.push({ x: -k, h: 1 / k });
      }
      drawFreqLines(lines, '#ef4444', 10, 80);
    }

    // Mod2: Discrete to Continuous
    else if (activeModule === 2) {
      const T = params.mod2.T;
      const pulseWidth = 1.0;
      const w0 = (2 * Math.PI) / T;
      
      drawSignal(ctx, (x) => {
        const xShift = x - (t * 2) % T;
        const periodX = ((xShift % T) + T) % T;
        return (periodX < pulseWidth || periodX > T - pulseWidth) ? 1 : 0;
      }, originX, timeOriginY, width, 40, 60, '#a78bfa');

      const sincFn = (w: number) => Math.abs(sinc(w, pulseWidth));
      drawContinuousFreq(sincFn, 'rgba(255, 255, 255, 0.2)', 20, 100);

      const lines = [];
      const numHarmonics = Math.floor(20 * T); 
      for (let k = -numHarmonics; k <= numHarmonics; k++) {
        const w = k * w0;
        lines.push({ x: w, h: sincFn(w) });
      }
      drawFreqLines(lines, '#c084fc', 20, 100);
    }

    // Mod3: Scaling
    else if (activeModule === 3) {
      const a = params.mod3.a;
      drawSignal(ctx, (x) => Math.abs(x - t) < a ? 1 : 0, originX, timeOriginY, width, 40, 80, '#34d399');

      drawContinuousFreq(
        (w) => (1 / a) * Math.abs(sinc(w * a, 1.0)),
        '#10b981', 10, 80
      );
    }

    // Mod4: LPF
    else if (activeModule === 4) {
      const Wc = params.mod4.Wc;
      const N_max = 31;
      
      drawSignal(ctx, (x) => {
        let sum = 0;
        for (let k = 1; k <= N_max; k += 2) {
          if (k <= Wc) {
            sum += (1 / k) * Math.sin(k * (x - t * 2));
          }
        }
        return sum;
      }, originX, timeOriginY, width, 40, 60, '#fbbf24');

      const lines = [];
      for (let k = 1; k <= N_max; k += 2) {
        lines.push({ x: k, h: 1 / k });
        lines.push({ x: -k, h: 1 / k });
      }
      
      drawFreqLines(lines, 'rgba(255,255,255,0.2)', 10, 80);
      const filteredLines = lines.filter(l => Math.abs(l.x) <= Wc);
      drawFreqLines(filteredLines, '#fbbf24', 10, 80);

      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
      const maskPxWidth = Wc * 10;
      ctx.fillRect(originX - maskPxWidth, halfH, maskPxWidth * 2, halfH);
    }

    // Mod5: Nyquist
    else if (activeModule === 5) {
      const fs = params.mod5.fs;
      const fm = 1.0; 
      
      drawSignal(ctx, (x) => Math.sin(2 * Math.PI * fm * (x - t)), originX, timeOriginY, width, 20, 60, 'rgba(255,255,255,0.3)');

      ctx.fillStyle = '#f43f5e';
      const sampleInterval = 1 / fs;
      for (let x = -20; x <= 20; x += sampleInterval) {
        const shiftedX = x + (t % sampleInterval);
        const px = originX + shiftedX * 20;
        const py = timeOriginY - Math.sin(2 * Math.PI * fm * shiftedX) * 60;
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      const drawTriangle = (centerX: number, color: string, isFill: boolean = false) => {
        const w = fm * 40;
        ctx.beginPath();
        ctx.moveTo(originX + centerX * 40, freqOriginY - 80);
        ctx.lineTo(originX + centerX * 40 - w, freqOriginY);
        ctx.lineTo(originX + centerX * 40 + w, freqOriginY);
        ctx.closePath();
        if (isFill) {
          ctx.fillStyle = color;
          ctx.fill();
        } else {
          ctx.strokeStyle = color;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      };

      const isAliasing = fs < 2 * fm;
      drawTriangle(0, '#10b981');
      for (let i = 1; i <= 5; i++) {
        drawTriangle(i * fs, 'rgba(255, 255, 255, 0.4)');
        drawTriangle(-i * fs, 'rgba(255, 255, 255, 0.4)');
      }

      if (isAliasing) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
        const overlapWidth = (2 * fm - fs) * 40;
        for (let i = 0; i < 5; i++) {
          const rightEdge = originX + (i * fs + fm) * 40;
          const leftEdgeOfNext = originX + ((i + 1) * fs - fm) * 40;
          ctx.beginPath();
          ctx.moveTo(rightEdge, freqOriginY);
          ctx.lineTo(leftEdgeOfNext, freqOriginY);
          const topY = freqOriginY - (overlapWidth / 2);
          ctx.lineTo((rightEdge + leftEdgeOfNext) / 2, topY);
          ctx.fill();
          
          const mRightEdge = originX - (i * fs + fm) * 40;
          const mLeftEdgeOfNext = originX - ((i + 1) * fs - fm) * 40;
          ctx.beginPath();
          ctx.moveTo(mRightEdge, freqOriginY);
          ctx.lineTo(mLeftEdgeOfNext, freqOriginY);
          ctx.lineTo((mRightEdge + mLeftEdgeOfNext) / 2, topY);
          ctx.fill();
        }
      }
    }
  }
}