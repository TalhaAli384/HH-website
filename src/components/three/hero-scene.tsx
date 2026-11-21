"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// Animated architectural scene for the home hero: glass towers assemble floor by
// floor while a tower crane swings overhead. Pure three.js primitives, no models.

const GOLD = new THREE.Color("#D6A84F");
const GOLD_LIGHT = new THREE.Color("#E8C682");
const GLASS = new THREE.Color("#1E3A5A");

const easeOutCubic = (x: number) => 1 - Math.pow(1 - x, 3);
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

type TowerProps = {
  position: [number, number, number];
  floors: number;
  width: number;
  depth: number;
  floorHeight?: number;
  delay?: number;
  instant: boolean;
};

function Tower({ position, floors, width, depth, floorHeight = 0.42, delay = 0, instant }: TowerProps) {
  const groups = useRef<(THREE.Group | null)[]>([]);

  const { slab, edges, band, mats } = useMemo(() => {
    const slab = new THREE.BoxGeometry(width, floorHeight * 0.92, depth);
    const edges = new THREE.EdgesGeometry(slab);
    const band = new THREE.BoxGeometry(width * 0.94, floorHeight * 0.38, depth * 0.94);
    // Per-floor materials so each floor can fade in independently.
    const mats = Array.from({ length: floors }, (_, i) => ({
      glass: new THREE.MeshStandardMaterial({
        color: GLASS,
        metalness: 0.6,
        roughness: 0.15,
        transparent: true,
        opacity: 0,
        emissive: GLASS,
        emissiveIntensity: 0.25,
      }),
      edge: new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0 }),
      light: new THREE.MeshBasicMaterial({
        color: i % 3 === 0 ? GOLD_LIGHT : GOLD,
        transparent: true,
        opacity: 0,
      }),
      flicker: Math.random() * Math.PI * 2,
      lit: Math.random() > 0.35,
    }));
    return { slab, edges, band, mats };
  }, [floors, width, depth, floorHeight]);

  useEffect(
    () => () => {
      slab.dispose();
      edges.dispose();
      band.dispose();
      mats.forEach((m) => [m.glass, m.edge, m.light].forEach((x) => x.dispose()));
    },
    [slab, edges, band, mats],
  );

  useFrame(({ clock }) => {
    const t = instant ? 999 : clock.elapsedTime - delay;
    for (let i = 0; i < floors; i++) {
      const g = groups.current[i];
      if (!g) continue;
      const p = easeOutCubic(clamp01((t - i * 0.16) / 0.7));
      g.position.y = i * floorHeight + floorHeight / 2 + (1 - p) * 2.2;
      const m = mats[i];
      m.glass.opacity = p * 0.42;
      m.edge.opacity = p * 0.9;
      const pulse = m.lit ? 0.55 + Math.sin(clock.elapsedTime * 0.8 + m.flicker) * 0.2 : 0.08;
      m.light.opacity = p * pulse;
    }
  });

  return (
    <group position={position}>
      {mats.map((m, i) => (
        <group key={i} ref={(el) => { groups.current[i] = el; }}>
          <mesh geometry={slab} material={m.glass} />
          <lineSegments geometry={edges} material={m.edge} />
          <mesh geometry={band} material={m.light} />
        </group>
      ))}
    </group>
  );
}

function Crane({ instant }: { instant: boolean }) {
  const jib = useRef<THREE.Group>(null);
  const hook = useRef<THREE.Group>(null);
  const cable = useRef<THREE.Mesh>(null);

  const { mastEdges, lineMat, solidMat } = useMemo(() => {
    const mast = new THREE.BoxGeometry(0.28, 9, 0.28, 1, 18, 1);
    return {
      mastEdges: new THREE.WireframeGeometry(mast),
      lineMat: new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.75 }),
      solidMat: new THREE.MeshStandardMaterial({ color: GOLD, metalness: 0.7, roughness: 0.35 }),
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (jib.current) jib.current.rotation.y = instant ? 0.6 : 0.6 + Math.sin(t * 0.25) * 0.9;
    const drop = instant ? 2.5 : 2.5 + Math.sin(t * 0.6) * 1.4;
    if (hook.current) hook.current.position.y = -drop;
    if (cable.current) {
      cable.current.scale.y = drop;
      cable.current.position.y = -drop / 2;
    }
  });

  return (
    <group position={[-3.2, 0, -1.6]}>
      <lineSegments geometry={mastEdges} material={lineMat} position={[0, 4.5, 0]} />
      <group ref={jib} position={[0, 9, 0]}>
        {/* Jib, counter-jib, counterweight and cab */}
        <mesh material={solidMat} position={[2.6, 0, 0]}>
          <boxGeometry args={[6.4, 0.16, 0.22]} />
        </mesh>
        <mesh material={solidMat} position={[-1.2, 0, 0]}>
          <boxGeometry args={[2.2, 0.16, 0.22]} />
        </mesh>
        <mesh material={solidMat} position={[-2, -0.25, 0]}>
          <boxGeometry args={[0.6, 0.5, 0.5]} />
        </mesh>
        <mesh material={solidMat} position={[0, 0.7, 0]}>
          <coneGeometry args={[0.18, 1.2, 4]} />
        </mesh>
        <group position={[4.4, 0, 0]}>
          <mesh ref={cable} material={lineMat}>
            <boxGeometry args={[0.02, 1, 0.02]} />
          </mesh>
          <group ref={hook}>
            <mesh material={solidMat}>
              <boxGeometry args={[0.7, 0.3, 0.5]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function Dust({ count }: { count: number }) {
  const points = useRef<THREE.Points>(null);
  const { geometry, speeds } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 18;
      positions[i * 3 + 1] = Math.random() * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
      speeds[i] = 0.15 + Math.random() * 0.35;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { geometry, speeds };
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((_, delta) => {
    const attr = geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * delta;
      if (arr[i * 3 + 1] > 10) arr[i * 3 + 1] = 0;
    }
    attr.needsUpdate = true;
    if (points.current) points.current.rotation.y += delta * 0.02;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial color={GOLD_LIGHT} size={0.05} sizeAttenuation transparent opacity={0.75} depthWrite={false} />
    </points>
  );
}

function Ground() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(40, 40, GOLD, GOLD);
    const mat = g.material as THREE.Material;
    mat.transparent = true;
    mat.opacity = 0.14;
    return g;
  }, []);
  return <primitive object={grid} />;
}

function CameraRig({ instant, compact }: { instant: boolean; compact: boolean }) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const target = useMemo(() => new THREE.Vector3(0.8, compact ? 3.6 : 4.2, 0), [compact]);
  const desired = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }) => {
    const radius = compact ? 19 : 21;
    const angle = (instant ? 0 : clock.elapsedTime * 0.06) + 0.75 + pointer.current.x * 0.25;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = (compact ? 6.5 : 7.5) - pointer.current.y * 1.2;
    camera.position.lerp(desired.set(x, y, z), 0.05);
    camera.lookAt(target);
  });

  return null;
}

function Scene({ instant, compact }: { instant: boolean; compact: boolean }) {
  return (
    <>
      <fog attach="fog" args={["#081726", 14, 34]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[6, 12, 8]} intensity={1.4} color="#fff3dc" />
      <pointLight position={[-4, 6, 4]} intensity={20} color="#D6A84F" distance={18} />
      <Ground />
      <Tower position={[0.6, 0, 0]} floors={compact ? 14 : 18} width={2.2} depth={2.2} delay={0.3} instant={instant} />
      <Tower position={[3.3, 0, -1.2]} floors={11} width={1.7} depth={1.9} delay={1.1} instant={instant} />
      <Tower position={[-1.6, 0, 2]} floors={7} width={2.4} depth={1.6} delay={1.8} instant={instant} />
      {!compact && <Tower position={[4.4, 0, 2.4]} floors={5} width={1.4} depth={1.4} delay={2.4} instant={instant} />}
      <Crane instant={instant} />
      <Dust count={compact ? 120 : 260} />
      <CameraRig instant={instant} compact={compact} />
    </>
  );
}

export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    setCompact(window.innerWidth < 768);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full" aria-hidden>
      <Canvas
        frameloop={visible ? "always" : "never"}
        dpr={[1, compact ? 1.5 : 1.75]}
        camera={{ position: [10, 6, 10], fov: compact ? 50 : 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <Scene instant={reduced} compact={compact} />
      </Canvas>
    </div>
  );
}
