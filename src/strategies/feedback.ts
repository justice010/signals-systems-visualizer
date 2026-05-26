import type { CanvasStrategy } from './index';
import type { ModuleId, ModuleParams } from '../types';
import { drawAxes } from '../utils/math';

export class FeedbackStrategy implements CanvasStrategy {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    globalTime: number,
    _activeModule: ModuleId,
    params: ModuleParams
  ): void {
    const { feedbackGain: K } = params.feedback;
    const halfH = height / 2;
    const originX = width / 2;
    const topOriginY = halfH / 2;

    const sScale = 60; // s-plane scale
    const tScaleY = 200; // time domain Y scale (larger since output is small K/(8+K))

    // --- 1. Top View: s-Plane (Root Locus) ---
    ctx.save();
    drawAxes(ctx, 0, width, halfH, "Root Locus: Poles of (s+2)(s+4)+K = 0");

    // Open loop poles at -2 and -4
    const drawX = (s: number, color: string, label: string) => {
        const px = originX + s * sScale;
        const py = topOriginY;
        const size = 6;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(px - size, py - size); ctx.lineTo(px + size, py + size);
        ctx.moveTo(px + size, py - size); ctx.lineTo(px - size, py + size);
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.fillText(label, px - 10, py + 20);
    };

    drawX(-2, 'rgba(255,255,255,0.3)', "s=-2");
    drawX(-4, 'rgba(255,255,255,0.3)', "s=-4");

    // Calculate closed loop poles: s = -3 +/- sqrt(1-K)
    let p1: {r: number, i: number}, p2: {r: number, i: number};
    if (K <= 1.0) {
        p1 = { r: -3 + Math.sqrt(1 - K), i: 0 };
        p2 = { r: -3 - Math.sqrt(1 - K), i: 0 };
    } else {
        p1 = { r: -3, i: Math.sqrt(K - 1) };
        p2 = { r: -3, i: -Math.sqrt(K - 1) };
    }

    // Draw Root Locus Paths (The geometry)
    ctx.strokeStyle = 'rgba(96, 165, 250, 0.2)';
    ctx.setLineDash([2, 2]);
    // Real axis part
    ctx.beginPath();
    ctx.moveTo(originX - 4 * sScale, topOriginY);
    ctx.lineTo(originX - 2 * sScale, topOriginY);
    ctx.stroke();
    // Complex part (vertical line at s=-3)
    ctx.beginPath();
    ctx.moveTo(originX - 3 * sScale, 0);
    ctx.lineTo(originX - 3 * sScale, halfH);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw dynamic poles (The ones moving with K)
    const drawActivePole = (p: {r: number, i: number}) => {
        const px = originX + p.r * sScale;
        const py = topOriginY - p.i * sScale;
        ctx.strokeStyle = '#f43f5e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        const s = 8;
        ctx.moveTo(px - s, py - s); ctx.lineTo(px + s, py + s);
        ctx.moveTo(px + s, py - s); ctx.lineTo(px - s, py + s);
        ctx.stroke();
        // Glow
        ctx.shadowBlur = 10; ctx.shadowColor = '#f43f5e'; ctx.stroke(); ctx.shadowBlur = 0;
    };

    drawActivePole(p1);
    drawActivePole(p2);

    ctx.restore();

    // --- 2. Bottom View: Step Response y(t) ---
    ctx.save();
    ctx.translate(0, halfH);
    drawAxes(ctx, 0, width, halfH, "Step Response: G(s) = K / [s^2 + 6s + (8+K)]");

    const getStepResponse = (t: number) => {
        if (t < 0) return 0;
        const steadyState = K / (8 + K);
        if (K < 1.0) {
            const s1 = -3 + Math.sqrt(1 - K);
            const s2 = -3 - Math.sqrt(1 - K);
            // y(t) = SS * [1 - (s2*e^s1t - s1*e^s2t)/(s2-s1)]
            return steadyState * (1 - (s2 * Math.exp(s1 * t) - s1 * Math.exp(s2 * t)) / (s2 - s1));
        } else if (Math.abs(K - 1.0) < 0.001) {
            return steadyState * (1 - Math.exp(-3 * t) * (1 + 3 * t));
        } else {
            const sigma = -3;
            const omega = Math.sqrt(K - 1);
            // y(t) = SS * [1 - e^sigmat * (cos wt - sigma/omega * sin wt)]
            return steadyState * (1 - Math.exp(sigma * t) * (Math.cos(omega * t) - (sigma / omega) * Math.sin(omega * t)));
        }
    };

    // Draw y(t)
    ctx.beginPath();
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 3;
    for (let i = 0; i < width; i++) {
        const t = i / 100; // 100 pixels per second
        const y = getStepResponse(t);
        const py = halfH - 20 - y * tScaleY; // Baseline slightly above bottom
        if (i === 0) ctx.moveTo(i, py);
        else ctx.lineTo(i, py);
    }
    ctx.stroke();

    // Steady State Line
    const ssVal = K / (8 + K);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    const ssY = halfH - 20 - ssVal * tScaleY;
    ctx.moveTo(0, ssY); ctx.lineTo(width, ssY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px sans-serif';
    ctx.fillText(`Steady State: ${ssVal.toFixed(3)}`, 10, ssY - 5);

    // Dynamic marker
    const tCurr = (globalTime * 2) % (width / 100);
    const yCurr = getStepResponse(tCurr);
    const mX = tCurr * 100;
    const mY = halfH - 20 - yCurr * tScaleY;
    ctx.beginPath();
    ctx.fillStyle = '#fff';
    ctx.arc(mX, mY, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}