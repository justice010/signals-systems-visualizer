import type { CanvasStrategy } from './index';
import type { ModuleId, ModuleParams } from '../types';
import { drawAxes } from '../utils/math';

export class StateSpaceStrategy implements CanvasStrategy {
  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    globalTime: number,
    _activeModule: ModuleId,
    params: ModuleParams
  ): void {
    const { dynamicsType } = params.stateSpace;
    const isUnstable = dynamicsType === 'saddle' || dynamicsType === 'unstable_node';

    const halfH = height / 2;
    
    // Grid Scaling
    const spaceScale = 40; // Reduced slightly for vertical layout
    const timeScaleX = 60; // Increased for wider time view
    const timeScaleY = 30; // Reduced for vertical compression

    // --- 1. Top View: Phase Portrait (x1 vs x2) ---
    ctx.save();
    drawAxes(ctx, 0, width, halfH, "Phase Portrait (x1 vs x2)");
    const originX = width / 2;
    const originY = halfH / 2;

    // Background flash for instability
    if (isUnstable) {
      const pulse = (Math.sin(globalTime * 5) + 1) / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${0.02 + pulse * 0.05})`;
      ctx.fillRect(0, 0, width, halfH);
    }

    // Matrix A and initial condition
    let A = [[-0.2, -1], [1, -0.2]]; // Default focus
    if (dynamicsType === 'center') A = [[0, -1], [1, 0]];
    if (dynamicsType === 'saddle') A = [[0.5, 0], [0, -0.5]];
    if (dynamicsType === 'unstable_node') A = [[0.5, 0.2], [0.1, 0.4]];

    const x0 = [2, 2];
    
    // RK4 Integrator for trajectory
    const dt = 0.05;
    const maxT = (globalTime % 15); // Loop every 15 seconds
    let currentX = [...x0];
    const trajectory = [[...x0]];

    const f = (x: number[]) => [
      A[0][0] * x[0] + A[0][1] * x[1],
      A[1][0] * x[0] + A[1][1] * x[1]
    ];

    for (let t = 0; t < maxT; t += dt) {
      const k1 = f(currentX);
      const k2 = f([currentX[0] + k1[0]*dt/2, currentX[1] + k1[1]*dt/2]);
      const k3 = f([currentX[0] + k2[0]*dt/2, currentX[1] + k2[1]*dt/2]);
      const k4 = f([currentX[0] + k3[0]*dt, currentX[1] + k3[1]*dt]);
      
      currentX[0] += (dt/6) * (k1[0] + 2*k2[0] + 2*k3[0] + k4[0]);
      currentX[1] += (dt/6) * (k1[1] + 2*k2[1] + 2*k3[1] + k4[1]);
      
      trajectory.push([...currentX]);
      
      // Limit explosion for visualization
      if (Math.abs(currentX[0]) > 30 || Math.abs(currentX[1]) > 30) break;
    }

    // Draw Flow Field (Arrows)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    const gridStep = 1.5;
    for (let gx = -8; gx <= 8; gx += gridStep) {
      for (let gy = -5; gy <= 5; gy += gridStep) {
        const dx = A[0][0] * gx + A[0][1] * gy;
        const dy = A[1][0] * gx + A[1][1] * gy;
        const mag = Math.sqrt(dx*dx + dy*dy) || 1;
        
        const sx = originX + gx * spaceScale;
        const sy = originY - gy * spaceScale;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx + (dx/mag) * 12, sy - (dy/mag) * 12);
        ctx.stroke();
      }
    }

    // Draw Trajectory
    ctx.beginPath();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2.5;
    trajectory.forEach((p, i) => {
      const px = originX + p[0] * spaceScale;
      const py = originY - p[1] * spaceScale;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Draw Energy Ball (Current State)
    const lastP = trajectory[trajectory.length - 1];
    const ballX = originX + lastP[0] * spaceScale;
    const ballY = originY - lastP[1] * spaceScale;
    
    const gradient = ctx.createRadialGradient(ballX, ballY, 0, ballX, ballY, 12);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(0.4, '#60a5fa');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(ballX, ballY, 12, 0, Math.PI * 2);
    ctx.fill();

    // Type Label (Top Right)
    ctx.textAlign = 'right';
    ctx.font = 'bold 18px sans-serif';
    ctx.fillStyle = isUnstable ? '#f87171' : '#34d399';
    ctx.fillText(dynamicsType.replace('_', ' ').toUpperCase(), width - 20, 35);

    ctx.restore();

    // --- 2. Bottom View: Time Domain (x1(t), x2(t)) ---
    ctx.save();
    ctx.translate(0, halfH);
    drawAxes(ctx, 0, width, halfH, "Time Domain Evolution (x1, x2 vs t)");
    const tOriginY = halfH / 2;
    const tOriginX = width / 2; // Keep time centered for aesthetic

    // x1(t) - Red
    ctx.beginPath();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 2;
    trajectory.forEach((p, i) => {
      const px = (tOriginX - (maxT * timeScaleX / 2)) + i * dt * timeScaleX;
      const py = tOriginY - p[0] * timeScaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    
    // x2(t) - Blue
    ctx.beginPath();
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    trajectory.forEach((p, i) => {
      const px = (tOriginX - (maxT * timeScaleX / 2)) + i * dt * timeScaleX;
      const py = tOriginY - p[1] * timeScaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Legend - Moved to bottom right to avoid overlap with title
    ctx.textAlign = 'right';
    ctx.font = '12px monospace';
    ctx.fillStyle = '#f43f5e';
    ctx.fillText("x1(t)", width - 20, halfH - 40);
    ctx.fillStyle = '#3b82f6';
    ctx.fillText("x2(t)", width - 20, halfH - 20);

    ctx.restore();
  }
}