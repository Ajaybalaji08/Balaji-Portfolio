import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Stars, OrbitControls, Float } from "@react-three/drei";
import * as THREE from "three";

interface HeroSceneProps {
  activeSection: string;
}

// Custom component to handle camera animations based on the active section
function CameraController({ activeSection }: { activeSection: string }) {
  const { camera } = useThree();
  
  // Define target positions and rotations for each section
  const targets = {
    hero: { pos: new THREE.Vector3(0, 0, 10), lookAt: new THREE.Vector3(0, 0, 0) },
    about: { pos: new THREE.Vector3(-4, 2, 8), lookAt: new THREE.Vector3(-1, 0, 0) },
    projects: { pos: new THREE.Vector3(4, -2, 7), lookAt: new THREE.Vector3(1, 0, 0) },
    skills: { pos: new THREE.Vector3(0, 5, 8), lookAt: new THREE.Vector3(0, 1, 0) },
    experience: { pos: new THREE.Vector3(-5, -3, 8), lookAt: new THREE.Vector3(-1, -1, 0) },
    github: { pos: new THREE.Vector3(3, 3, 9), lookAt: new THREE.Vector3(1, 1, 0) },
    contact: { pos: new THREE.Vector3(0, -6, 12), lookAt: new THREE.Vector3(0, -2, 0) },
  };

  useFrame((state) => {
    const target = targets[activeSection as keyof typeof targets] || targets.hero;
    
    // Smoothly interpolate (lerp) camera position
    camera.position.lerp(target.pos, 0.05);
    
    // Smoothly interpolate camera lookAt
    const currentLookAt = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion).add(camera.position);
    currentLookAt.lerp(target.lookAt, 0.05);
    camera.lookAt(currentLookAt);
  });

  return null;
}

// The central glowing star of the space
function CentralStar() {
  const starRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (starRef.current) {
      starRef.current.rotation.y += 0.005;
      starRef.current.rotation.x += 0.002;
    }
    if (glowRef.current) {
      // Create a pulsating breathing effect for the star's outer halo
      const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.08;
      glowRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Core Star */}
      <mesh ref={starRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="#00f0ff"
          emissive="#0055ff"
          emissiveIntensity={2}
          roughness={0.1}
          metalness={0.9}
          wireframe={true}
        />
      </mesh>

      {/* Pulsing Outer Shield Wireframe */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshBasicMaterial
          color="#d946ef"
          wireframe={true}
          transparent={true}
          opacity={0.15}
        />
      </mesh>

      {/* Point Light emanating from the star */}
      <pointLight color="#00f0ff" intensity={5} distance={50} decay={1.5} />
    </group>
  );
}

// A Saturn-like customizable planet orbiting the star
function OrbitingPlanet() {
  const groupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Circular orbit path animation
      const time = state.clock.getElapsedTime() * 0.15;
      groupRef.current.position.x = Math.sin(time) * 5.5;
      groupRef.current.position.z = Math.cos(time) * 5.5;
      groupRef.current.position.y = Math.sin(time * 0.5) * 1.5;
      groupRef.current.rotation.y += 0.01;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = Math.PI / 2.3;
      ringRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Planet Core */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial
            color="#ec4899"
            emissive="#a21caf"
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Flat Saturn Planet Rings */}
        <mesh ref={ringRef} receiveShadow>
          <ringGeometry args={[0.9, 1.4, 64]} />
          <meshStandardMaterial
            color="#3b82f6"
            emissive="#1d4ed8"
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
            transparent={true}
            opacity={0.8}
            wireframe={true}
          />
        </mesh>

        {/* Tiny Orbiting Moon */}
        <mesh position={[1.2, 0.2, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial
            color="#10b981"
            emissive="#059669"
            emissiveIntensity={0.8}
            roughness={0.1}
          />
        </mesh>
      </Float>
    </group>
  );
}

// Floating technical space artifacts representing projects and data nodes
function DataNodes() {
  const nodesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (nodesRef.current) {
      nodesRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
    }
  });

  const nodePositions = [
    { pos: [-4, 3, -3], color: "#00f0ff" },
    { pos: [5, -2, -4], color: "#10b981" },
    { pos: [-3, -4, 2], color: "#ec4899" },
    { pos: [3, 4, 3], color: "#f59e0b" },
  ];

  return (
    <group ref={nodesRef}>
      {nodePositions.map((node, i) => (
        <group key={i} position={node.pos as [number, number, number]}>
          <Float speed={1.5} rotationIntensity={1} floatIntensity={0.5}>
            <mesh>
              <octahedronGeometry args={[0.3, 0]} />
              <meshStandardMaterial
                color={node.color}
                emissive={node.color}
                emissiveIntensity={0.6}
                wireframe={true}
              />
            </mesh>
            <mesh scale={[1.2, 1.2, 1.2]}>
              <octahedronGeometry args={[0.3, 0]} />
              <meshBasicMaterial
                color={node.color}
                transparent={true}
                opacity={0.1}
              />
            </mesh>
          </Float>
        </group>
      ))}
    </group>
  );
}

// Floating futuristic 3D structures
function FloatingStructures() {
  const knotRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (knotRef.current) {
      knotRef.current.rotation.y = time * 0.15;
      knotRef.current.rotation.z = time * 0.05;
    }
    if (ringRef.current) {
      ringRef.current.rotation.x = time * 0.1;
      ringRef.current.rotation.y = time * 0.2;
    }
  });

  return (
    <group>
      {/* 3D Cyber Torus Knot on the right */}
      <group position={[4, 1.5, -2]}>
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.8}>
          <mesh ref={knotRef}>
            <torusKnotGeometry args={[0.5, 0.16, 100, 16, 3, 4]} />
            <meshStandardMaterial
              color="#d946ef"
              emissive="#a21caf"
              emissiveIntensity={0.8}
              wireframe={true}
            />
          </mesh>
        </Float>
      </group>

      {/* 3D Geometric Ring on the left */}
      <group position={[-4, -2, -1]}>
        <Float speed={2} rotationIntensity={0.8} floatIntensity={1}>
          <mesh ref={ringRef}>
            <torusGeometry args={[0.6, 0.12, 16, 100]} />
            <meshStandardMaterial
              color="#00f0ff"
              emissive="#0055ff"
              emissiveIntensity={0.8}
              wireframe={true}
            />
          </mesh>
        </Float>
      </group>
    </group>
  );
}

export default function HeroScene({ activeSection }: HeroSceneProps) {
  return (
    <div className="absolute inset-0 w-full h-full -z-10 bg-slate-950 overflow-hidden pointer-events-none">
      {/* Nebula ambient styling */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-pink-500/10 blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-2/3 w-[350px] h-[350px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-5, -5, -2]} intensity={0.5} />

        {/* Central Star Core */}
        <CentralStar />

        {/* Orbiting Ringed Planet and Moon */}
        <OrbitingPlanet />

        {/* Floating Cybernetic Data Nodes */}
        <DataNodes />

        {/* Floating Cyber Torus Knot and Torus Ring */}
        <FloatingStructures />

        {/* Interactive Space Particle Starfield */}
        <Stars
          radius={120}
          depth={60}
          count={3500}
          factor={7}
          saturation={0.5}
          fade={true}
          speed={1.5}
        />

        {/* Active camera position controller */}
        <CameraController activeSection={activeSection} />

        {/* Subtle orbit helper to allow micro-gestures on mouse drag */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate={true}
          rotateSpeed={0.3}
          maxPolarAngle={Math.PI / 1.5}
          minPolarAngle={Math.PI / 3}
        />
      </Canvas>
    </div>
  );
}
