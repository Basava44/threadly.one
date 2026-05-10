"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useGLTF, Center } from "@react-three/drei";
import * as THREE from "three";
import { useEditorStore } from "../store/useEditorStore";
import { useTextureSync } from "../hooks/useTextureSync";
import { STUDIO_PRODUCTS } from "../constants/products";

interface ProductViewerProps {
  canvasElement: HTMLCanvasElement | null;
}

function ProductModel({ canvasElement }: { canvasElement: HTMLCanvasElement | null }) {
  const { activeProduct, productColor } = useEditorStore();
  const config = STUDIO_PRODUCTS[activeProduct];
  const textureRef = useTextureSync(canvasElement);
  const modelRef = useRef<THREE.Group>(null);

  const { scene } = useGLTF(config.model);

  // Clone scene and apply materials
  const clonedScene = useMemo(() => {
    const clone = scene.clone();

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(productColor),
          roughness: 0.7,
          metalness: 0.05,
        });
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    return clone;
  }, [scene, productColor]);

  // Apply texture from Fabric canvas as a decal on the front-facing mesh
  useFrame(() => {
    if (!textureRef.current || !modelRef.current) return;

    modelRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (mat && textureRef.current) {
          // Apply as an alpha map overlay
          mat.map = textureRef.current;
          mat.needsUpdate = true;
        }
      }
    });
  });

  return (
    <Center>
      <group ref={modelRef} scale={config.scale}>
        <primitive object={clonedScene} />
      </group>
    </Center>
  );
}

function LoadingSpinner() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.x += delta * 2;
  });
  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[0.3, 0.05, 16, 32]} />
      <meshStandardMaterial color="#1A1A1A" />
    </mesh>
  );
}

export default function ProductViewer({ canvasElement }: ProductViewerProps) {
  const { activeProduct } = useEditorStore();
  const config = STUDIO_PRODUCTS[activeProduct];

  return (
    <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: config.cameraPosition, fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <directionalLight position={[-3, 3, -3]} intensity={0.3} />

        <Suspense fallback={<LoadingSpinner />}>
          <ProductModel canvasElement={canvasElement} />
          <Environment preset="studio" />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={6}
          autoRotate={false}
          dampingFactor={0.05}
          enableDamping
        />
      </Canvas>
    </div>
  );
}

// Preload models
Object.values(STUDIO_PRODUCTS).forEach((p) => {
  useGLTF.preload(p.model);
});
