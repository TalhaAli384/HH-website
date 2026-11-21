"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

// three.js is only downloaded when a 3D canvas is about to scroll into view,
// and never when WebGL is unavailable.
const HeroSceneImpl = dynamic(() => import("./hero-scene"), { ssr: false });
const LogoCoinImpl = dynamic(() => import("./logo-coin"), { ssr: false });

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

function useNearViewport(rootMargin = "200px") {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!hasWebGL()) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setReady(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, ready };
}

export function HeroScene({ className }: { className?: string }) {
  const { ref, ready } = useNearViewport("0px");
  return (
    <div ref={ref} className={className}>
      {ready && <HeroSceneImpl />}
    </div>
  );
}

export function LogoCoin({ className }: { className?: string }) {
  const { ref, ready } = useNearViewport();
  return (
    <div ref={ref} className={className}>
      {ready && <LogoCoinImpl />}
    </div>
  );
}
