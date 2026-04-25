import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface GlitchedTextProps {
  text: string;
  className?: string;
  glow?: boolean;
}

export const GlitchedText: React.FC<GlitchedTextProps> = ({ text, className = "", glow = true }) => {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.9) {
        setOffset({
          x: (Math.random() - 0.5) * 4,
          y: (Math.random() - 0.5) * 4,
        });
        setTimeout(() => setOffset({ x: 0, y: 0 }), 50);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`relative inline-block ${className} ${glow ? 'neon-text-cyan' : ''}`}>
      <span className="relative z-10">{text}</span>
      <span 
        className="absolute top-0 left-0 text-neon-magenta opacity-70 z-0"
        style={{ transform: `translate(${offset.x}px, ${offset.y}px)` }}
      >
        {text}
      </span>
      <span 
        className="absolute top-0 left-0 text-neon-cyan opacity-70 z-0"
        style={{ transform: `translate(${-offset.x}px, ${-offset.y}px)` }}
      >
        {text}
      </span>
    </div>
  );
};
