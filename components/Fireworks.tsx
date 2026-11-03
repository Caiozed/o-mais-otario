"use client";

import { useEffect, useState, type CSSProperties } from "react";

type Burst = {
  id: number;
  x: number;
  y: number;
  particles: { angle: number; color: string; delay: number; dist: number }[];
};

const COLORS = [
  "#ff6b9d",
  "#f0d78c",
  "#9b6bff",
  "#5eead4",
  "#fb923c",
  "#f472b6",
  "#fde047",
  "#38bdf8",
];

let burstId = 0;

export type FireworksHandle = {
  celebrate: (origin?: { x: number; y: number }) => void;
};

type Props = {
  register: (handle: FireworksHandle) => void;
};

export function Fireworks({ register }: Props) {
  const [bursts, setBursts] = useState<Burst[]>([]);

  useEffect(() => {
    register({
      celebrate(origin) {
        const x = origin?.x ?? window.innerWidth * (0.35 + Math.random() * 0.3);
        const y = origin?.y ?? window.innerHeight * (0.25 + Math.random() * 0.25);
        const particles = Array.from({ length: 28 }, (_, i) => ({
          angle: (360 / 28) * i + Math.random() * 12,
          color: COLORS[i % COLORS.length],
          delay: Math.random() * 0.08,
          dist: 70 + Math.random() * 110,
        }));

        const id = ++burstId;
        setBursts((prev) => [...prev, { id, x, y, particles }]);

        // Extra secondary pops for a richer show
        window.setTimeout(() => {
          const id2 = ++burstId;
          setBursts((prev) => [
            ...prev,
            {
              id: id2,
              x: x + (Math.random() * 120 - 60),
              y: y + (Math.random() * 80 - 40),
              particles: Array.from({ length: 18 }, (_, i) => ({
                angle: (360 / 18) * i + Math.random() * 10,
                color: COLORS[(i + 3) % COLORS.length],
                delay: Math.random() * 0.05,
                dist: 50 + Math.random() * 80,
              })),
            },
          ]);
          window.setTimeout(() => {
            setBursts((prev) => prev.filter((b) => b.id !== id2));
          }, 1100);
        }, 180);

        window.setTimeout(() => {
          setBursts((prev) => prev.filter((b) => b.id !== id));
        }, 1200);
      },
    });
  }, [register]);

  if (bursts.length === 0) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      aria-hidden
    >
      {bursts.map((burst) => (
        <div
          key={burst.id}
          className="absolute"
          style={{ left: burst.x, top: burst.y }}
        >
          <span className="firework-flash" />
          {burst.particles.map((p, i) => (
            <span
              key={i}
              className="firework-particle"
              style={
                {
                  "--angle": `${p.angle}deg`,
                  "--dist": `${p.dist}px`,
                  "--delay": `${p.delay}s`,
                  background: p.color,
                  boxShadow: `0 0 6px ${p.color}`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      ))}
    </div>
  );
}
