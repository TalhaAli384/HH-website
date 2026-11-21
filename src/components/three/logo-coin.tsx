"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

// The company badge rendered as a slowly spinning gold coin that leans toward the cursor.

function Coin({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const texture = useLoader(THREE.TextureLoader, "/logo.png");

  const materials = useMemo(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    // Cylinder cap UVs are rotated a quarter turn relative to the image.
    texture.center.set(0.5, 0.5);
    texture.rotation = Math.PI / 2;
    const rim = new THREE.MeshStandardMaterial({ color: "#D6A84F", metalness: 1, roughness: 0.28 });
    const face = new THREE.MeshStandardMaterial({ map: texture, metalness: 0.25, roughness: 0.45, transparent: true });
    // CylinderGeometry material groups: [side, top cap, bottom cap]
    return [rim, face, face];
  }, [texture]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    const t = clock.elapsedTime;
    // Gentle sway (rather than a full spin) keeps the logo face readable.
    const sway = reduced ? 0 : Math.sin(t * 0.7) * 0.55;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, sway + pointer.current.x * 0.35, 0.08);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.current.y * 0.25, 0.06);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -pointer.current.x * 0.25, 0.06);
    g.position.y = reduced ? 0 : Math.sin(t * 1.2) * 0.12;
  });

  return (
    <group ref={group}>
      {/* Inner group stands the cylinder up so its face points at the camera. */}
      <group rotation={[Math.PI / 2, 0, 0]}>
      <mesh material={materials}>
        <cylinderGeometry args={[1.6, 1.6, 0.22, 96, 1]} />
      </mesh>
      {/* Raised outer ring for a minted edge */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.6, 0.06, 16, 96]} />
        <meshStandardMaterial color="#E8C682" metalness={1} roughness={0.2} />
      </mesh>
      </group>
    </group>
  );
}

export default function LogoCoin() {
  const ref = useRef<HTMLDivElement>(null);
  // Starts running: the lazy wrapper only mounts this once it is near the viewport.
  const [visible, setVisible] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="h-full w-full" aria-hidden>
      <Canvas frameloop={visible ? "always" : "never"} dpr={[1, 1.75]} camera={{ position: [0, 0, 5.2], fov: 40 }} gl={{ alpha: true, antialias: true }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[3, 4, 5]} intensity={2.2} color="#fff6e5" />
        <pointLight position={[-4, -2, 3]} intensity={30} color="#D6A84F" />
        <pointLight position={[4, 2, -3]} intensity={25} color="#ffffff" />
        <Suspense fallback={null}>
          <Coin reduced={reduced} />
        </Suspense>
      </Canvas>
    </div>
  );
}
