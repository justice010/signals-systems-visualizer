import type { CanvasStrategy } from './index';
import type { ModuleId, ModuleParams } from '../types';
import { drawAxes } from '../utils/math';

export class ZDomainStrategy implements CanvasStrategy {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    globalTime: number,
    _activeModule: ModuleId,
    params: ModuleParams
  ): void {
    const { poleRadius, poleAngle } = params.zDomain;
    const isUnstable = poleRadius > 1.0;
    const isMarginal = Math.abs(poleRadius - 1.0) < 0.02;

    const halfH = height / 2;
    const originX = width / 2;
    const topOriginY = halfH / 2;
    const bottomOriginY = halfH + halfH / 2;

    // Grid Scaling
    const zScale = 80; 
    const nScaleX = 22; // Adjusted for better visibility
    const nScaleY = 50; 

    // Reset textAlign for each render to avoid overlap bugs
    ctx.textAlign = 'left';

    // --- Background Flash for Instability ---
    if (isUnstable) {
      const pulse = (Math.sin(globalTime * 10) + 1) / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${0.05 + pulse * 0.1})`;
      ctx.fillRect(0, 0, width, halfH);
    }

    // --- 1. Upper View: Z-Plane ---
    drawAxes(ctx, 0, width, halfH, "z-Plane (Discrete Complex Frequency Domain)");
    
    // Draw Unit Circle
    ctx.strokeStyle = isUnstable ? '#f87171' : 'rgba(255, 255, 255, 0.6)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(originX, topOriginY, zScale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Poles
    const drawPole = (r: number, theta: number) => {
      const px = originX + r * Math.cos(theta) * zScale;
      const py = topOriginY - r * Math.sin(theta) * zScale;
      const size = 8;

      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px - size, py - size);
      ctx.lineTo(px + size, py + size);
      ctx.moveTo(px + size, py - size);
      ctx.lineTo(px - size, py + size);
      ctx.stroke();

      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ef4444';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    drawPole(poleRadius, poleAngle);
    if (Math.abs(poleAngle) > 0.01) {
      drawPole(poleRadius, -poleAngle);
    }

    // Status Text (Centered in the upper quadrant)
    ctx.save();
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    if (isUnstable) {
        ctx.fillStyle = '#f87171';
        ctx.fillText("SYSTEM UNSTABLE!", originX + width/4, 40);
    } else if (isMarginal) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText("MARGINALLY STABLE", originX + width/4, 40);
    } else {
        ctx.fillStyle = '#34d399';
        ctx.fillText("SYSTEM STABLE", originX + width/4, 40);
    }
    ctx.restore();

    // Axis Labels
    ctx.fillStyle = '#fff';
    ctx.font = 'italic 14px serif';
    ctx.fillText("Re(z)", width - 60, topOriginY - 10);
    ctx.fillText("Im(z)", originX + 10, 20);

    // --- 2. Lower View: Discrete Impulse Response h[n] ---
    drawAxes(ctx, halfH, width, halfH, "Impulse Response h[n] = r^n \u22C5 cos(\u03B8n)");

    const getH = (n: number) => {
        return Math.pow(poleRadius, n) * Math.cos(poleAngle * n);
    };

    // Static Stem Plot (Interactive Dynamic: updates as user moves sliders)
    const maxSamples = 35;
    const startX = originX - (maxSamples / 2) * nScaleX;

    for (let n = 0; n < maxSamples; n++) {
        let val = getH(n);
        
        // Safety for Infinity
        if (!isFinite(val)) val = val > 0 ? 1000 : -1000;

        const px = startX + n * nScaleX;
        let py = bottomOriginY - val * nScaleY;
        
        // Clamp for drawing
        if (py < halfH) py = halfH + 5;
        if (py > height) py = height - 5;

        // Draw stem
        ctx.beginPath();
        ctx.strokeStyle = isUnstable ? '#f43f5e' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.moveTo(px, bottomOriginY);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Draw dot
        ctx.beginPath();
        ctx.fillStyle = isUnstable ? '#f43f5e' : '#fff';
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        if (!isUnstable) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Sample n label (cleaner, every 5 samples)
        if (n % 5 === 0) {
            ctx.fillStyle = '#666';
            ctx.font = '10px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(n.toString(), px, bottomOriginY + 15);
        }
    }

    // Parameter label at bottom (Fixed position, avoid overlap)
    ctx.textAlign = 'left';
    ctx.fillStyle = '#888';
    ctx.font = '12px monospace';
    ctx.fillText(`Pole: r=${poleRadius.toFixed(2)}, \u03B8=${poleAngle.toFixed(2)} rad`, 20, height - 15);
  }
}