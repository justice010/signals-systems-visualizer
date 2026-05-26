import type { CanvasStrategy } from './index';
import type { ModuleId, ModuleParams } from '../types';
import { drawAxes } from '../utils/math';

export class VectorSpaceStrategy implements CanvasStrategy {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _globalTime: number,
    _activeModule: ModuleId,
    params: ModuleParams
  ): void {
    const { projectionAxes: K } = params.vectorSpace;
    const halfH = height / 2;

    const scaleX = 40; 
    const scaleY = 60;

    // --- 1. Top View: Time Domain Orthogonal Decomposition ---
    ctx.save();
    drawAxes(ctx, 0, width, halfH, "Time Domain: Orthogonal Projection");
    const originX = width / 2;
    const topOriginY = halfH / 2;

    // Target Signal: Square Wave (dashed)
    const targetSignal = (t: number) => (Math.floor(t / Math.PI) % 2 === 0 ? 1 : -1);
    
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    for (let i = 0; i < width; i++) {
        const t = (i - originX) / scaleX;
        const y = targetSignal(t);
        if (i === 0) ctx.moveTo(i, topOriginY - y * scaleY);
        else ctx.lineTo(i, topOriginY - y * scaleY);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Orthogonal Basis and Coefficients
    const coefficients: number[] = [];
    const sumSignal = (t: number) => {
        let sum = 0;
        for (let i = 0; i < K; i++) {
            const k = 2 * i + 1;
            const ck = 4 / (Math.PI * k);
            sum += ck * Math.sin(k * t);
        }
        return sum;
    };

    // Draw Individual Components (faint)
    for (let i = 0; i < K; i++) {
        const k = 2 * i + 1;
        const ck = 4 / (Math.PI * k);
        coefficients.push(ck);
        
        ctx.beginPath();
        ctx.strokeStyle = `rgba(96, 165, 250, ${0.1 + (0.4 / (i + 1))})`;
        ctx.lineWidth = 1;
        for (let j = 0; j < width; j++) {
            const t = (j - originX) / scaleX;
            const y = ck * Math.sin(k * t);
            if (j === 0) ctx.moveTo(j, topOriginY - y * scaleY);
            else ctx.lineTo(j, topOriginY - y * scaleY);
        }
        ctx.stroke();
    }

    // Draw Approximated Sum
    ctx.beginPath();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    for (let i = 0; i < width; i++) {
        const t = (i - originX) / scaleX;
        const y = sumSignal(t);
        if (i === 0) ctx.moveTo(i, topOriginY - y * scaleY);
        else ctx.lineTo(i, topOriginY - y * scaleY);
    }
    ctx.stroke();

    ctx.restore();

    // --- 2. Bottom View: Parseval's Energy Conservation ---
    ctx.save();
    ctx.translate(0, halfH);
    drawAxes(ctx, 0, width, halfH, "Energy Space: Parseval's Theorem");

    const barOriginX = 250; // Shifted right to make room for big numbers
    const barOriginY = halfH - 60;
    const barWidth = Math.min(40, (width - barOriginX - 100) / K - 10);
    const barGap = 15;

    const totalEnergy = 1.0; 
    let currentSumEnergy = 0;
    
    coefficients.forEach((ck, i) => {
        const energyK = (ck * ck) / 2;
        currentSumEnergy += energyK;
        
        const px = barOriginX + i * (barWidth + barGap);
        const h = energyK * (halfH - 120); 
        
        // Draw Bar
        const grad = ctx.createLinearGradient(px, barOriginY, px, barOriginY - h);
        grad.addColorStop(0, '#3b82f6');
        grad.addColorStop(1, '#60a5fa');
        ctx.fillStyle = grad;
        ctx.fillRect(px, barOriginY - h, barWidth, h);
        
        // Label (smaller for better fit)
        ctx.fillStyle = '#888';
        ctx.font = '9px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`k=${2*i+1}`, px + barWidth/2, barOriginY + 20);
    });

    // Total Energy Reference Line
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    const refY = barOriginY - totalEnergy * (halfH - 120);
    ctx.beginPath();
    ctx.moveTo(barOriginX - 10, refY);
    ctx.lineTo(width - 40, refY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Big Info Numbers - Stacked on the left of bottom view
    ctx.textAlign = 'left';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("Energy Sum (\u2211 c\u1D4F\u00B2/2):", 40, 50);
    ctx.font = 'bold 28px monospace';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(currentSumEnergy.toFixed(4), 40, 85);

    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("Total Energy (\u222B x\u00B2):", 40, 130);
    ctx.font = 'bold 28px monospace';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText(totalEnergy.toFixed(4), 40, 165);

    const ratio = (currentSumEnergy / totalEnergy) * 100;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText(`Conservation: ${ratio.toFixed(1)}%`, 40, 200);

    ctx.restore();
  }
}
