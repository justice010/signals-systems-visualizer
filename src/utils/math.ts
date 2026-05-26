/**
 * Signals & Systems Common Math Utilities
 */

export const sinc = (w: number, width: number = 1.0) => {
  if (w === 0) return 1;
  return Math.sin(w * width) / (w * width);
};

export const drawAxes = (
  ctx: CanvasRenderingContext2D,
  yOffset: number,
  width: number,
  height: number,
  label: string
) => {
  ctx.save();
  ctx.translate(0, yOffset);
  
  ctx.beginPath();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1;
  // x-axis
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  // y-axis
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.stroke();

  ctx.fillStyle = '#888';
  ctx.font = '14px sans-serif';
  ctx.fillText(label, 10, 20);
  
  ctx.restore();
};

export const drawSignal = (
  ctx: CanvasRenderingContext2D,
  fn: (x: number) => number,
  originX: number,
  originY: number,
  width: number,
  scaleX: number,
  scaleY: number,
  color: string
) => {
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  for (let i = 0; i < width; i++) {
    const x = (i - originX) / scaleX;
    const y = fn(x);
    if (i === 0) ctx.moveTo(i, originY - y * scaleY);
    else ctx.lineTo(i, originY - y * scaleY);
  }
  ctx.stroke();
};
