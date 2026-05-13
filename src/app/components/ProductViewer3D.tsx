"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Environment, Text } from "@react-three/drei";
import * as THREE from "three";
import type { CustomizerProduct } from "@/app/data/products";

// Local font paths
const FONT_URLS: Record<string, string> = {
  serif: "/fonts/playfair.ttf",
  sans: "/fonts/inter.ttf",
  script: "/fonts/dancing-script.ttf",
};

const MODEL_PATHS: Record<CustomizerProduct, string | null> = {
  cap: "/models/bucket_hat.glb",
  tee: "/models/tee.glb",
  tote: "/models/tote.glb",
};

// Text position [x, y, z] — z must be just barely in front of mesh surface
const TEXT_POSITION: Record<CustomizerProduct, [number, number, number]> = {
  cap: [0, 0.05, 0.35],
  tee: [0.08, 0.2, 0.1],
  tote: [0, 0.25, 0.52],
};

const TEXT_SIZE: Record<CustomizerProduct, number> = {
  cap: 0.01,
  tee: 0.03,
  tote: 0.2,
};

function ProductModel({
  product,
  color,
  text,
  textColor,
  fontStyle = "serif",
  fontSize = 1,
  viewAngle = 0,
}: {
  product: CustomizerProduct;
  color: string;
  text: string;
  textColor: string;
  fontStyle?: string;
  fontSize?: number;
  viewAngle?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_PATHS[product]!);

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
      {text && (
        <Text
          position={TEXT_POSITION[product]}
          fontSize={TEXT_SIZE[product] * fontSize}
          color={textColor}
          font={FONT_URLS[fontStyle] || FONT_URLS.serif}
          anchorX="center"
          anchorY="middle"
          letterSpacing={fontStyle === "sans" ? 0.08 : 0.05}
          depthOffset={-1}
        >
          {text}
        </Text>
      )}
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

function LoadingSpinner() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z -= delta * 2;
  });
  return (
    <mesh ref={ref}>
      <torusGeometry args={[0.3, 0.05, 8, 32]} />
      <meshBasicMaterial color="#999" />
    </mesh>
  );
}

export function ProductViewer3D({
  product,
  color,
  text,
  textColor,
  fontStyle = "serif",
  fontSize = 1,
  viewAngle = 0,
  enableZoom = false,
  onGlReady,
}: {
  product: CustomizerProduct;
  color: string;
  text: string;
  textColor: string;
  fontStyle?: string;
  fontSize?: number;
  viewAngle?: number;
  enableZoom?: boolean;
  onGlReady?: (gl: THREE.WebGLRenderer) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.3, 3], fov: 45 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
      onCreated={({ gl }) => onGlReady?.(gl)}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-3, 2, -2]} intensity={0.3} />

      <Suspense fallback={<LoadingSpinner />}>
        {MODEL_PATHS[product] ? (
          <ProductModel key={`${product}-${viewAngle}`} product={product} color={color} text={text} textColor={textColor} fontStyle={fontStyle} fontSize={fontSize} viewAngle={viewAngle} />
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
  );
}
