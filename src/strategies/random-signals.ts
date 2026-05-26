import type { CanvasStrategy } from './index';
import type { ModuleId, ModuleParams } from '../types';
import { drawAxes } from '../utils/math';

export class RandomSignalsStrategy implements CanvasStrategy {
  private whiteNoiseBuffer: number[] = [];
  private filteredNoiseBuffer: number[] = [];
  private lastFilteredValue: number = 0;
  private maxBufferSize: number = 400;

  render(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    _globalTime: number,
    _activeModule: ModuleId,
    params: ModuleParams
  ): void {
    const { noiseIntensity, systemBandwidth } = params.randomSignals;
    const halfH = height / 2;
    const originX = width / 2;
    const topOriginY = halfH / 2;

    // --- 1. Real-time Waveform Generation ---
    // Generate new sample
    const noise = (Math.random() - 0.5) * noiseIntensity;
    
    // Low-pass Filter (EMA)
    // Alpha controlled by systemBandwidth
    const alpha = systemBandwidth / 40; 
    const filtered = this.lastFilteredValue + alpha * (noise - this.lastFilteredValue);
    this.lastFilteredValue = filtered;

    this.whiteNoiseBuffer.push(noise);
    this.filteredNoiseBuffer.push(filtered);

    if (this.whiteNoiseBuffer.length > this.maxBufferSize) {
      this.whiteNoiseBuffer.shift();
      this.filteredNoiseBuffer.shift();
    }

    // --- 2. Top View: Time Domain Oscilloscope ---
    ctx.save();
    drawAxes(ctx, 0, width, halfH, "Real-time Oscilloscope (White vs. Filtered Noise)");
    
    // Draw Grid (Scope style)
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, halfH); ctx.stroke();
    }
    for (let y = 0; y < halfH; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }

    const scaleY = 15;
    const stepX = width / this.maxBufferSize;

    // White Noise (Dark grey, shaky)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;
    this.whiteNoiseBuffer.forEach((val, i) => {
      const px = i * stepX;
      const py = topOriginY - val * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    // Filtered Noise (Glowing green)
    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = '#10b981';
    this.filteredNoiseBuffer.forEach((val, i) => {
      const px = i * stepX;
      const py = topOriginY - val * scaleY;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.shadowBlur = 0;

    ctx.restore();

    // --- 3. Bottom View: Power Spectral Density (PSD) ---
    ctx.save();
    ctx.translate(0, halfH);
    drawAxes(ctx, 0, width, halfH, "Power Spectral Density (PSD) S(j\u03C9)");

    const wScaleX = 15;
    const psdScaleY = 100;

    // White Noise PSD (Flat line)
    const whitePsd = (noiseIntensity * noiseIntensity) / 12; // Approximation
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(0, halfH - 40 - whitePsd * psdScaleY);
    ctx.lineTo(width, halfH - 40 - whitePsd * psdScaleY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '10px sans-serif';
    ctx.fillText("White Noise PSD (N0/2)", 10, halfH - 45 - whitePsd * psdScaleY);

    // Colored Noise PSD (Lorentzian/Low-pass shape: S_out = S_in * |H|^2)
    // |H(jw)|^2 = 1 / (1 + (w/wc)^2) for a simple 1st order filter
    ctx.beginPath();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 3;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.1)';
    
    const wc = systemBandwidth;
    for (let i = 0; i < width; i++) {
      const w = (i - originX) / wScaleX;
      const h2 = 1 / (1 + (w * w) / (wc * wc));
      const psd = whitePsd * h2;
      const py = halfH - 40 - psd * psdScaleY;
      
      if (i === 0) ctx.moveTo(i, py);
      else ctx.lineTo(i, py);
    }
    ctx.stroke();
    // Fill the PSD area
    ctx.lineTo(width, halfH - 40);
    ctx.lineTo(0, halfH - 40);
    ctx.fill();

    ctx.restore();
  }
}
