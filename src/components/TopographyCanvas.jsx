import React, { useEffect, useRef } from 'react';

const point = (x, y) => ({ x, y });
const add = (p1, p2) => ({ x: p1.x + p2.x, y: p1.y + p2.y });
const sub = (p1, p2) => ({ x: p1.x - p2.x, y: p1.y - p2.y });
const scale = (p, s) => ({ x: p.x * s, y: p.y * s });
const lerp = (p1, p2, t) => ({ x: p1.x + (p2.x - p1.x) * t, y: p1.y + (p2.y - p1.y) * t });
const lerpScalar = (v1, v2, t) => v1 + (v2 - v1) * t;
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const remap = (val, inMin, inMax, outMin, outMax) => ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;

export default function TopographyCanvas({ minLines = 2, maxLines = 45, lineWidth = 1, lineColor = 'rgba(0, 0, 0, 0.45)' }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const paramsRef = useRef({ linesNumber: 38, bias: 0.5 });
  const animIdRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      mouseRef.current.x = rect.width / 2;
      mouseRef.current.y = rect.height / 2;
      mouseRef.current.targetX = rect.width / 2;
      mouseRef.current.targetY = rect.height / 2;
    };

    resize();

    const draw = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      const m = mouseRef.current;
      const p = paramsRef.current;

      m.x += (m.targetX - m.x) * 0.05;
      m.y += (m.targetY - m.y) * 0.1;

      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);

      const isMobile = width < 500;
      const shift = isMobile ? 0.8 * height : 0;
      const power = isMobile ? 1.5 : 0.7;

      const topPoint = point(width, -(1.1 * height) + shift);
      const bottomPoint = point(0, 2 * height);
      const leftPoint = point(-width, -height + shift);

      const lines = clamp(remap(m.y, 0, height, minLines, maxLines), minLines, maxLines);
      p.linesNumber = lerpScalar(p.linesNumber, lines, 0.1);

      const b = clamp(remap(m.x, 0, width, 0.6, 0.4), 0.4, 0.6);
      p.bias = lerpScalar(p.bias, b, 0.05);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;

      const total = Math.round(p.linesNumber);
      for (let i = 0; i < total; i++) {
        const t = i / (total - 1 || 1);
        const curvePoint = point(lerpScalar(bottomPoint.x, leftPoint.x, 1 - t * t), lerpScalar(bottomPoint.y, leftPoint.y, 1 - t * t));
        const mid = add(scale(topPoint, 0.5), scale(curvePoint, 0.5));
        const diff = sub(scale(add(bottomPoint, mid), 0.5), lerp(topPoint, curvePoint, 0.5));

        ctx.beginPath();
        for (let s = 0; s <= 50; s++) {
          const stepT = s / 50;
          const curvePos = add(
            lerp(topPoint, curvePoint, stepT),
            scale(diff, 2 * Math.pow(stepT, power * (1 - p.bias) * 2) * Math.pow(1 - stepT, power * p.bias * 2))
          );
          if (s === 0) ctx.moveTo(curvePos.x, curvePos.y);
          else ctx.lineTo(curvePos.x, curvePos.y);
        }
        ctx.stroke();
      }

      ctx.restore();
      animIdRef.current = requestAnimationFrame(draw);
    };

    animIdRef.current = requestAnimationFrame(draw);

    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    return () => {
      cancelAnimationFrame(animIdRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [minLines, maxLines, lineWidth, lineColor]);

  return (
    <div
      ref={containerRef}
      className="topography-bg-container"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
