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
    const halfW = width / 2;

    const scaleX = 40; 
    const scaleY = 60;

    // --- 1. Left View: Time Domain Orthogonal Decomposition ---
    ctx.save();
    drawAxes(ctx, 0, halfW, height, "Time Domain: Orthogonal Projection");
    const originX = halfW / 2;
    const originY = height / 2;

    // Target Signal: Square Wave (dashed)
    const targetSignal = (t: number) => (Math.floor(t / Math.PI) % 2 === 0 ? 1 : -1);
    
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    for (let i = 0; i < halfW; i++) {
        const t = (i - originX) / scaleX;
        const y = targetSignal(t);
        if (i === 0) ctx.moveTo(i, originY - y * scaleY);
        else ctx.lineTo(i, originY - y * scaleY);
    }
    ctx.stroke();
    ctx.setLineDash([]);

    // Orthogonal Basis and Coefficients
    // c_k = (4/pi) * (1/k) for odd k
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
        for (let j = 0; j < halfW; j++) {
            const t = (j - originX) / scaleX;
            const y = ck * Math.sin(k * t);
            if (j === 0) ctx.moveTo(j, originY - y * scaleY);
            else ctx.lineTo(j, originY - y * scaleY);
        }
        ctx.stroke();
    }

    // Draw Approximated Sum
    ctx.beginPath();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 3;
    for (let i = 0; i < halfW; i++) {
        const t = (i - originX) / scaleX;
        const y = sumSignal(t);
        if (i === 0) ctx.moveTo(i, originY - y * scaleY);
        else ctx.lineTo(i, originY - y * scaleY);
    }
    ctx.stroke();

    ctx.restore();

    // --- 2. Right View: Parseval's Energy Conservation ---
    ctx.save();
    ctx.translate(halfW, 0);
    drawAxes(ctx, 0, halfW, height, "Energy Space: Parseval's Theorem");

    const barOriginX = 60;
    const barOriginY = height - 80;
    const barWidth = 40;
    const barGap = 20;

    // Signal Total Energy (Integration of x^2 over one period 2*pi is 2*pi)
    // Normalized to 1.0 for simplicity in visualization
    const totalEnergy = 1.0; 
    
    // Basis Energy Components sum (Sum of ck^2 / 2 for each sine over period 2pi)
    // ck^2 * (1/2) is the energy of ck*sin(kt) relative to square wave
    // For square wave 4/pi sum 1/k sin(kt), sum of (ck^2/2) = (8/pi^2) * sum(1/k^2)
    // The sum of 1/k^2 for odd k is pi^2 / 8. So it converges to 1.
    let currentSumEnergy = 0;
    
    coefficients.forEach((ck, i) => {
        const energyK = (ck * ck) / 2;
        currentSumEnergy += energyK;
        
        const px = barOriginX + i * (barWidth + barGap);
        const h = energyK * (height - 200); // Scale for visual
        
        // Draw Bar
        const grad = ctx.createLinearGradient(px, barOriginY, px, barOriginY - h);
        grad.addColorStop(0, '#3b82f6');
        grad.addColorStop(1, '#60a5fa');
        ctx.fillStyle = grad;
        ctx.fillRect(px, barOriginY - h, barWidth, h);
        
        // Label
        ctx.fillStyle = '#888';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`k=${2*i+1}`, px + barWidth/2, barOriginY + 20);
    });

    // Total Energy Reference Line
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    const refY = barOriginY - totalEnergy * (height - 200);
    ctx.beginPath();
    ctx.moveTo(barOriginX - 10, refY);
    ctx.lineTo(halfW - 40, refY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Big Info Numbers
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("Energy Sum (\u2211 c\u1D4F\u00B2/2):", 40, 60);
    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = '#60a5fa';
    ctx.fillText(currentSumEnergy.toFixed(4), 40, 100);

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fff';
    ctx.fillText("Signal Total Energy (\u222B x\u00B2):", 40, 160);
    ctx.font = 'bold 32px monospace';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText(totalEnergy.toFixed(4), 40, 200);

    const ratio = (currentSumEnergy / totalEnergy) * 100;
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText(`Conservation: ${ratio.toFixed(1)}%`, 40, 240);

    ctx.restore();
  }
}
