import type { CanvasStrategy } from './index';
import type { ModuleId, ModuleParams } from '../types';
import { drawAxes } from '../utils/math';

export class SDomainStrategy implements CanvasStrategy {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    globalTime: number,
    _activeModule: ModuleId,
    params: ModuleParams
  ): void {
    const { sigma, omega } = params.sDomain;
    const isUnstable = sigma > 0;
    const isMarginal = Math.abs(sigma) < 0.05;

    const halfH = height / 2;
    const originX = width / 2;
    const topOriginY = halfH / 2;
    const bottomOriginY = halfH + halfH / 2;

    // Grid Scaling
    const sScale = 25; // 25 pixels per unit in s-plane
    const tScaleX = 40; // time domain X scale
    const tScaleY = 50; // time domain Y scale

    // --- Background Flash for Instability ---
    if (isUnstable) {
      const pulse = (Math.sin(globalTime * 10) + 1) / 2; // 0 to 1
      ctx.fillStyle = `rgba(239, 68, 68, ${0.05 + pulse * 0.1})`; // Subtle red pulse
      ctx.fillRect(0, 0, width, halfH);
    }

    // --- 1. Upper View: S-Plane (Pole-Zero Plot) ---
    drawAxes(ctx, 0, width, halfH, "s-Plane (Complex Frequency Domain)");
    
    // Highlight jw-axis (The Fourier Boundary)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, halfH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw grid units
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.font = '10px sans-serif';
    for (let i = -10; i <= 10; i++) {
        if (i === 0) continue;
        const x = originX + i * sScale;
        const y = topOriginY - i * sScale;
        ctx.fillText(i.toString(), x - 5, topOriginY + 15);
        ctx.fillText(i + "j", originX + 5, y + 5);
    }

    // Draw Poles (Red X)
    const drawPole = (s: number, w: number) => {
      const px = originX + s * sScale;
      const py = topOriginY - w * sScale;
      const size = 8;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px - size, py - size);
      ctx.lineTo(px + size, py + size);
      ctx.moveTo(px + size, py - size);
      ctx.lineTo(px - size, py + size);
      ctx.stroke();

      // Glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ef4444';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    drawPole(sigma, omega);
    if (Math.abs(omega) > 0.01) {
      drawPole(sigma, -omega);
    }

    // Status Text
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    if (isUnstable) {
        ctx.fillStyle = '#f87171';
        ctx.fillText("SYSTEM UNSTABLE!", originX + width/4, 50);
    } else if (isMarginal) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText("CRITICALLY STABLE", originX + width/4, 50);
    } else {
        ctx.fillStyle = '#34d399';
        ctx.fillText("SYSTEM STABLE", originX + width/4, 50);
    }

    // Axis Labels
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';
    ctx.font = 'italic 14px serif';
    ctx.fillText("\u03C3 (Real)", width - 70, topOriginY - 10);
    ctx.fillText("j\u03C9 (Imaginary)", originX + 10, 20);

    // --- 2. Lower View: Impulse Response h(t) ---
    drawAxes(ctx, halfH, width, halfH, "Impulse Response h(t) = e^(\u03C3t) \u22C5 sin(\u03C9t)");

    ctx.beginPath();
    ctx.strokeStyle = isUnstable ? '#f43f5e' : '#34d399';
    ctx.lineWidth = 2.5;

    // Calculation: h(t) = exp(sigma*t) * sin(omega*t)
    // We normalize omega slightly for visual appeal if it's very small
    const drawH = (t: number) => {
        if (t < 0) return 0;
        // If omega is 0, draw pure exponential
        if (Math.abs(omega) < 0.01) return Math.exp(sigma * t);
        return Math.exp(sigma * t) * Math.sin(omega * t);
    };

    // Draw the curve
    for (let i = 0; i < width; i++) {
        const tVal = (i - originX) / tScaleX;
        const val = drawH(tVal);
        const py = bottomOriginY - val * tScaleY;
        
        if (i === 0) ctx.moveTo(i, py);
        else ctx.lineTo(i, py);
    }
    ctx.stroke();

    // Draw envelope (optional but pro)
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    for (let i = originX; i < width; i++) {
        const tVal = (i - originX) / tScaleX;
        const env = Math.exp(sigma * tVal);
        ctx.lineTo(i, bottomOriginY - env * tScaleY);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let i = originX; i < width; i++) {
        const tVal = (i - originX) / tScaleX;
        const env = -Math.exp(sigma * tVal);
        ctx.lineTo(i, bottomOriginY - env * tScaleY);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Live tracking dot
    const tCurrent = (globalTime % 10); // Loop 10 seconds
    const dotX = originX + tCurrent * tScaleX;
    const dotY = bottomOriginY - drawH(tCurrent) * tScaleY;
    
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(dotX, dotY, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pole coordinates label
    ctx.fillStyle = '#888';
    ctx.font = '12px monospace';
    ctx.fillText(`Poles: ${sigma.toFixed(2)} \u00B1 ${omega.toFixed(2)}j`, 20, height - 20);
  }
}