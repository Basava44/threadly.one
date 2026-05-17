"use client";

import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment } from "@react-three/drei";
import * as THREE from "three";
import Lottie from "lottie-react";
import sewingAnimation from "@/app/assets/Sewing.json";
import type { CustomizerProduct } from "@/app/data/products";

const MODEL_PATHS: Record<CustomizerProduct, string | null> = {
  cap: "/models/bucket_hat.glb",
  tee: "/models/tee.glb",
  tote: "/models/tote.glb",
};

function ProductModel({
  product,
  color,
  viewAngle = 0,
  onLoaded,
}: {
  product: CustomizerProduct;
  color: string;
  viewAngle?: number;
  onLoaded?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATHS[product]!);

  useEffect(() => { onLoaded?.(); }, [scene, onLoaded]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child: THREE.Object3D) => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(color),
          roughness: 0.7,
          metalness: 0.05,
        });
      }
    });
    return clone;
  }, [scene, color]);


  const scale = product === "tee" ? 2.5 : product === "tote" ? 0.28 : 6.2;

  return (
    <group ref={groupRef} scale={scale} rotation={[0, viewAngle, 0]}>
      <Center>
        <primitive object={clonedScene} />
      </Center>
    </group>
  );
}

function FallbackPlaceholder({
  product,
  color,
}: {
  product: CustomizerProduct;
  color: string;
}) {
  const groupRef = useRef<THREE.Group>(null);


  const geometry = useMemo(() => {
    switch (product) {
      case "cap":
        return <capsuleGeometry args={[0.6, 0.3, 16, 32]} />;
      case "tee":
        return <boxGeometry args={[1.2, 1.5, 0.4]} />;
      case "tote":
        return <boxGeometry args={[1, 1.4, 0.3]} />;
    }
  }, [product]);

  return (
    <group ref={groupRef}>
      <mesh>
        {geometry}
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
      </mesh>
    </group>
  );
}


export function ProductViewer3D({
  product,
  color,
  viewAngle = 0,
  onGlReady,
}: {
  product: CustomizerProduct;
  color: string;
  text?: string;
  textColor?: string;
  fontStyle?: string;
  fontSize?: number;
  viewAngle?: number;
  enableZoom?: boolean;
  onGlReady?: (gl: THREE.WebGLRenderer) => void;
}) {
  const [loading, setLoading] = useState(true);

  return (
    <div className="relative w-full h-full">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <Lottie animationData={sewingAnimation} loop className="w-32 h-32" />
        </div>
      )}
      <Canvas
        camera={{ position: [0, 0.3, 3], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        onCreated={({ gl }) => onGlReady?.(gl)}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-3, 2, -2]} intensity={0.3} />

        <Suspense fallback={null}>
          {MODEL_PATHS[product] ? (
            <ProductModel key={`${product}-${viewAngle}`} product={product} color={color} viewAngle={viewAngle} onLoaded={() => setLoading(false)} />
          ) : (
            <FallbackPlaceholder key={product} product={product} color={color} />
          )}
          <Environment preset="studio" environmentIntensity={0.4} />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={false}
        />
      </Canvas>
    </div>
  );
}
