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

    // Define Matrix A for x' = Ax
    let a11 = 0, a12 = 0, a21 = 0, a22 = 0;
    let isUnstable = false;

    switch (dynamicsType) {
      case 'stable_focus':
        a11 = -0.2; a12 = -1;
        a21 = 1;    a22 = -0.2;
        break;
      case 'center':
        a11 = 0; a12 = -1;
        a21 = 1; a22 = 0;
        break;
      case 'saddle':
        a11 = 1;  a12 = 0;
        a21 = 0;  a22 = -1;
        isUnstable = true;
        break;
      case 'unstable_node':
        a11 = 0.5; a12 = 0;
        a21 = 0;   a22 = 0.8;
        isUnstable = true;
        break;
    }

    const halfH = height / 2;
    const originX = width / 2;
    const phaseOriginY = halfH / 2;
    const timeOriginY = halfH + halfH / 2;

    const scalePhase = 40; // pixels per unit
    const scaleTimeX = 40; 
    const scaleTimeY = 30;

    // Numerical integration (Euler) for trajectory
    const dt = 0.02;
    const x0 = [2, 2]; // Initial state
    let currX = x0[0];
    let currY = x0[1];

    // Current time in the simulation
    const simTimeLimit = 20;
    const tCurrent = globalTime % simTimeLimit;

    // Flash background for instability
    if (isUnstable) {
      const pulse = (Math.sin(globalTime * 10) + 1) / 2;
      ctx.fillStyle = `rgba(239, 68, 68, ${0.03 + pulse * 0.05})`;
      ctx.fillRect(0, 0, width, halfH);
    }

    // --- 1. Phase Portrait (Left/Upper View) ---
    drawAxes(ctx, 0, width, halfH, "Phase Portrait: x\u2082 vs x\u2081");

    // Draw Vector Field (Optional but pro: tiny arrows)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    for (let i = -5; i <= 5; i += 1) {
      for (let j = -5; j <= 5; j += 1) {
        const dx = a11 * i + a12 * j;
        const dy = a21 * i + a22 * j;
        const mag = Math.sqrt(dx*dx + dy*dy) || 1;
        const px = originX + i * scalePhase;
        const py = phaseOriginY - j * scalePhase;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + (dx/mag) * 10, py - (dy/mag) * 10);
        ctx.stroke();
      }
    }

    // Compute and draw trajectory
    ctx.beginPath();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    
    let stateX = currX;
    let stateY = currY;
    
    // We compute full trajectory but only show up to tCurrent
    const steps = Math.floor(tCurrent / dt);
    const historyX: number[] = [];
    const historyY: number[] = [];

    for (let s = 0; s <= steps; s++) {
      historyX.push(stateX);
      historyY.push(stateY);
      
      const px = originX + stateX * scalePhase;
      const py = phaseOriginY - stateY * scalePhase;
      
      if (s === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);

      // Derivatives
      const dx = a11 * stateX + a12 * stateY;
      const dy = a21 * stateX + a22 * stateY;
      
      // Update state (Euler)
      stateX += dx * dt;
      stateY += dy * dt;

      // Safety: stop if out of bounds
      if (Math.abs(stateX) > 100 || Math.abs(stateY) > 100) break;
    }
    ctx.stroke();

    // Draw energy ball (Current State)
    const lastX = historyX[historyX.length - 1] || currX;
    const lastY = historyY[historyY.length - 1] || currY;
    const ballPX = originX + lastX * scalePhase;
    const ballPY = phaseOriginY - lastY * scalePhase;

    ctx.beginPath();
    const gradient = ctx.createRadialGradient(ballPX, ballPY, 0, ballPX, ballPY, 10);
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(0.4, '#38bdf8');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.arc(ballPX, ballPY, 10, 0, Math.PI * 2);
    ctx.fill();

    // Axis labels
    ctx.fillStyle = '#888';
    ctx.font = 'italic 12px serif';
    ctx.fillText("x\u2081 (State 1)", width - 60, phaseOriginY - 10);
    ctx.fillText("x\u2082 (State 2)", originX + 10, 20);

    // --- 2. Time Domain Evolution (Lower View) ---
    drawAxes(ctx, halfH, width, halfH, "State Evolution: x\u2081(t) [Red] and x\u2082(t) [Blue]");

    // Draw x1(t) - Red
    ctx.beginPath();
    ctx.strokeStyle = '#f87171';
    ctx.lineWidth = 2;
    for (let i = 0; i < historyX.length; i++) {
        const px = originX + (i * dt) * scaleTimeX;
        const py = timeOriginY - historyX[i] * scaleTimeY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Draw x2(t) - Blue
    ctx.beginPath();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 2;
    for (let i = 0; i < historyY.length; i++) {
        const px = originX + (i * dt) * scaleTimeX;
        const py = timeOriginY - historyY[i] * scaleTimeY;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
    }
    ctx.stroke();

    // Labels and Status
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'right';
    if (isUnstable) {
        ctx.fillStyle = '#f87171';
        ctx.fillText("UNSTABLE DYNAMICS", width - 20, height - 60);
    } else {
        ctx.fillStyle = '#34d399';
        ctx.fillText("STABLE CONVERGENCE", width - 20, height - 60);
    }
    
    ctx.font = '12px monospace';
    ctx.fillStyle = '#888';
    ctx.fillText(`Matrix A = [[${a11}, ${a12}], [${a21}, ${a22}]]`, width - 20, height - 30);
  }
}