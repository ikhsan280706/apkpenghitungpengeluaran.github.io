import React, { useMemo } from 'react';

export default function Starfield() {
  // Generate random static particles for stars
  const stars = useMemo(() => {
    return Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1}px`,
      duration: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 5}s`,
      opacity: Math.random() * 0.7 + 0.3,
      color: i % 5 === 0 ? '#60a5fa' : i % 7 === 0 ? '#a78bfa' : '#ffffff',
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Deep Space Radial Nebula Aura */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-10 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Twinkling Stars */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star-particle"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
            boxShadow: `0 0 8px ${star.color}`,
            '--duration': star.duration,
            '--delay': star.delay,
          }}
        />
      ))}

      {/* Cosmic Shooting Star Graphic */}
      <div className="absolute top-20 right-1/3 w-32 h-[1px] bg-gradient-to-r from-transparent via-cyan-400 to-white opacity-40 rotate-[-35deg] animate-pulse"></div>
    </div>
  );
}
