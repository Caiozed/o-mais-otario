"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  score: number;
  className?: string;
};

export function ScoreValue({ score, className = "" }: Props) {
  const prev = useRef(score);
  const [pop, setPop] = useState(false);

  useEffect(() => {
    if (prev.current === score) return;
    prev.current = score;
    setPop(false);
    const frame = requestAnimationFrame(() => setPop(true));
    const timeout = window.setTimeout(() => setPop(false), 450);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [score]);

  return (
    <span className={`${className} inline-block ${pop ? "anim-score-pop" : ""}`}>
      {score} pts
    </span>
  );
}
