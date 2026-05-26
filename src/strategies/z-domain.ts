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
    const zScale = 80; // pixels per unit in z-plane (larger because unit circle is small)
    const nScaleX = 25; // discrete time X scale (pixels per sample)
    const nScaleY = 50; // discrete time Y scale

    // --- Background Flash for Instability ---
    if (isUnstable) {
      const pulse = (Math.sin(globalTime * 10) + 1) / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${0.05 + pulse * 0.1})`;
      ctx.fillRect(0, 0, width, halfH);
    }

    // --- 1. Upper View: Z-Plane (Pole-Zero Plot) ---
    drawAxes(ctx, 0, width, halfH, "z-Plane (Discrete Complex Frequency)");
    
    // Draw Unit Circle (The Boundary)
    ctx.strokeStyle = isUnstable ? '#f87171' : 'rgba(255, 255, 255, 0.6)';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(originX, topOriginY, zScale, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight axes intersection at origin
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.arc(originX, topOriginY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw Poles (Red X)
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

      // Glow effect
      ctx.shadowBlur = 15;
      ctx.shadowColor = '#ef4444';
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    drawPole(poleRadius, poleAngle);
    if (Math.abs(poleAngle) > 0.01) {
      drawPole(poleRadius, -poleAngle);
    }

    // Stability Status Text
    ctx.font = 'bold 24px sans-serif';
    ctx.textAlign = 'center';
    if (isUnstable) {
        ctx.fillStyle = '#f87171';
        ctx.fillText("SYSTEM UNSTABLE!", originX + width/4, 50);
    } else if (isMarginal) {
        ctx.fillStyle = '#fbbf24';
        ctx.fillText("MARGINALLY STABLE / OSCILLATOR", originX + width/4, 50);
    } else {
        ctx.fillStyle = '#34d399';
        ctx.fillText("SYSTEM STABLE", originX + width/4, 50);
    }

    // Axis Labels
    ctx.textAlign = 'left';
    ctx.fillStyle = '#fff';
    ctx.font = 'italic 14px serif';
    ctx.fillText("Re(z)", width - 60, topOriginY - 10);
    ctx.fillText("Im(z)", originX + 10, 20);

    // --- 2. Lower View: Discrete Impulse Response h[n] ---
    drawAxes(ctx, halfH, width, halfH, "Impulse Response h[n] = r^n \u22C5 cos(\u03B8n)");

    // Calculation: h[n] = poleRadius^n * cos(poleAngle * n)
    const getH = (n: number) => {
        return Math.pow(poleRadius, n) * Math.cos(poleAngle * n);
    };

    // Stem Plot (Fire matches)
    const maxSamples = 40;
    const startX = originX - (maxSamples / 2) * nScaleX;

    for (let n = 0; n < maxSamples; n++) {
        const val = getH(n);
        const px = startX + n * nScaleX;
        const py = bottomOriginY - val * nScaleY;

        // Draw vertical line (stem)
        ctx.beginPath();
        ctx.strokeStyle = isUnstable ? '#f43f5e' : '#38bdf8';
        ctx.lineWidth = 2;
        ctx.moveTo(px, bottomOriginY);
        ctx.lineTo(px, py);
        ctx.stroke();

        // Draw dot at top
        ctx.beginPath();
        ctx.fillStyle = isUnstable ? '#f43f5e' : '#fff';
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
        if (!isUnstable) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }

    // Draw envelope (dashed)
    ctx.setLineDash([2, 4]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    for (let n = 0; n < maxSamples; n++) {
        const env = Math.pow(poleRadius, n);
        const px = startX + n * nScaleX;
        if (n === 0) ctx.moveTo(px, bottomOriginY - env * nScaleY);
        else ctx.lineTo(px, bottomOriginY - env * nScaleY);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let n = 0; n < maxSamples; n++) {
        const env = -Math.pow(poleRadius, n);
        const px = startX + n * nScaleX;
        if (n === 0) ctx.moveTo(px, bottomOriginY - env * nScaleY);
        else ctx.lineTo(px, bottomOriginY - env * nScaleY);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Parameter label
    ctx.fillStyle = '#888';
    ctx.font = '12px monospace';
    ctx.fillText(`Pole Polar: r = ${poleRadius.toFixed(2)}, \u03B8 = ${poleAngle.toFixed(2)} rad`, 20, height - 20);
  }
}