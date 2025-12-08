import React, { useRef, useEffect } from 'react';
import { AppPhase } from '../types';

interface NeuroKnotProps {
  phase: AppPhase;
  completionRatio: number; // 0 to 1
}

const NeuroKnot: React.FC<NeuroKnotProps> = ({ phase, completionRatio }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<any[]>([]);
  const animationFrameId = useRef<number>(0);

  // Linear Interpolation Helper
  const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

  // Configuration based on phase and progress
  const getConfig = (p: AppPhase, progress: number) => {
    switch (p) {
      case AppPhase.GATE:
      case AppPhase.INPUT:
        return { color: '239, 68, 68', chaos: 0.8, speed: 0.5, connectionDist: 100, form: 'CHAOS' }; // Red
      
      case AppPhase.PROCESSING_1:
        return { color: '239, 68, 68', chaos: 1.2, speed: 1.5, connectionDist: 80, form: 'CHAOS' }; // High agitation

      case AppPhase.QUESTIONS:
        // INTERPOLATION PHASE: Untangle based on progress (0.0 to 1.0)
        // Color: Red (239, 68, 68) -> Indigo (99, 102, 241) -> Cyan (6, 182, 212)
        // Let's LERP straight from Red to Cyan for simplicity and impact
        const r = Math.round(lerp(239, 6, progress));
        const g = Math.round(lerp(68, 182, progress));
        const b = Math.round(lerp(68, 212, progress));
        
        return { 
          color: `${r}, ${g}, ${b}`, 
          chaos: lerp(0.8, 0.2, progress),     // Chaos reduces
          speed: lerp(0.5, 0.3, progress),     // Speed slows down
          connectionDist: lerp(100, 140, progress), // Connections loosen
          form: 'CHAOS' // Still chaotic but "calming down"
        };

      case AppPhase.PROCESSING_2:
        return { color: '99, 102, 241', chaos: 0.1, speed: 1.0, connectionDist: 150, form: 'FLOW' }; // Transition to flow

      case AppPhase.CLARITY:
        return { color: '6, 182, 212', chaos: 0.05, speed: 0.2, connectionDist: 120, form: 'GEOMETRY' }; // Blue/Clarity
        
      default:
        return { color: '255, 255, 255', chaos: 0.5, speed: 0.5, connectionDist: 100, form: 'CHAOS' };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Initialize particles
    const particleCount = width < 768 ? 60 : 120;
    if (particles.current.length === 0) {
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 2 + 1,
          angle: Math.random() * Math.PI * 2
        });
      }
    }

    const render = () => {
      const config = getConfig(phase, completionRatio);
      
      // Soft trail effect
      ctx.fillStyle = `rgba(3, 7, 18, 0.2)`; 
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;

      particles.current.forEach((p, index) => {
        // Physics Updates based on Form
        if (config.form === 'CHAOS') {
          // Jittery, tangled movement
          p.x += p.vx * config.speed + (Math.random() - 0.5) * config.chaos * 2;
          p.y += p.vy * config.speed + (Math.random() - 0.5) * config.chaos * 2;
        } else if (config.form === 'FLOW') {
          // Flowing stream/waves
          p.x += p.vx * config.speed;
          p.y += Math.sin(p.x * 0.01 + Date.now() * 0.001) * 2;
        } else if (config.form === 'GEOMETRY') {
          // Move towards a geometric pattern (Circle)
          const radius = Math.min(width, height) * 0.3;
          const targetAngle = (index / particles.current.length) * Math.PI * 2 + (Date.now() * 0.0001);
          const tx = centerX + Math.cos(targetAngle) * radius;
          const ty = centerY + Math.sin(targetAngle) * radius;
          
          p.x += (tx - p.x) * 0.05;
          p.y += (ty - p.y) * 0.05;
        }

        // Boundary wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${config.color}, 0.8)`;
        ctx.fill();

        // Draw Connections
        particles.current.forEach((p2) => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < config.connectionDist) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(${config.color}, ${1 - dist / config.connectionDist})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        });
      });

      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [phase, completionRatio]);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 z-0 pointer-events-none transition-colors duration-1000 ease-in-out"
    />
  );
};

export default NeuroKnot;