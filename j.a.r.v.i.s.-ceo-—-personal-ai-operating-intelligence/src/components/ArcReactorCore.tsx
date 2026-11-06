import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export type CoreStatus =
  | 'IDLE'
  | 'LISTENING'
  | 'THINKING'
  | 'SPEAKING'
  | 'EXECUTING'
  | 'ERROR'
  | 'OFFLINE';

interface ArcReactorCoreProps {
  status: CoreStatus;
  audioLevel?: number;
  interactive?: boolean;
  onCoreClick?: () => void;
  className?: string;
}

export const ArcReactorCore: React.FC<ArcReactorCoreProps> = ({
  status,
  audioLevel = 0,
  onCoreClick,
  className = 'w-64 h-64 md:w-80 md:h-80'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<CoreStatus>(status);
  const audioLevelRef = useRef<number>(audioLevel);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => {
    audioLevelRef.current = audioLevel;
  }, [audioLevel]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'low-power'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    container.appendChild(renderer.domElement);

    // Group for all core components
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Energy Sphere (Points Cloud)
    const particleCount = 280;
    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.05 + (Math.random() - 0.5) * 0.15;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      originalPositions[i * 3] = x;
      originalPositions[i * 3 + 1] = y;
      originalPositions[i * 3 + 2] = z;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00f0ff,
      size: 0.055,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    coreGroup.add(particles);

    // 2. Inner Glowing Core
    const innerSphereGeo = new THREE.SphereGeometry(0.75, 24, 24);
    const innerSphereMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending
    });
    const innerSphere = new THREE.Mesh(innerSphereGeo, innerSphereMat);
    coreGroup.add(innerSphere);

    // 3. Middle Torus Ring
    const middleTorusGeo = new THREE.TorusGeometry(1.65, 0.035, 12, 48);
    const middleTorusMat = new THREE.MeshBasicMaterial({
      color: 0x00b4d8,
      transparent: true,
      opacity: 0.75
    });
    const middleTorus = new THREE.Mesh(middleTorusGeo, middleTorusMat);
    coreGroup.add(middleTorus);

    // 4. Outer Segmented Arc Ring (HUD Ring)
    const outerRingGeo = new THREE.RingGeometry(2.1, 2.18, 48);
    const outerRingMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.55
    });
    const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat);
    coreGroup.add(outerRing);

    // 5. Technical Reticle Blades (10 Segment Coils)
    const bladeGroup = new THREE.Group();
    const bladeCount = 10;
    const bladeGeo = new THREE.BoxGeometry(0.08, 0.35, 0.04);
    const bladeMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.85
    });

    for (let i = 0; i < bladeCount; i++) {
      const angle = (i / bladeCount) * Math.PI * 2;
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.x = Math.cos(angle) * 1.65;
      blade.position.y = Math.sin(angle) * 1.65;
      blade.rotation.z = angle + Math.PI / 2;
      bladeGroup.add(blade);
    }
    coreGroup.add(bladeGroup);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const render = () => {
      const elapsedTime = clock.getElapsedTime();
      const currentStatus = statusRef.current;
      const audioPulse = audioLevelRef.current || 0;

      // Status specific dynamics
      let rotSpeed = 0.4;
      let targetColor = 0x00f0ff;
      let targetOpacity = 0.85;

      switch (currentStatus) {
        case 'LISTENING':
          rotSpeed = 0.8;
          targetColor = 0x00ffcc;
          targetOpacity = 0.95;
          break;
        case 'THINKING':
          rotSpeed = 2.2;
          targetColor = 0x38bdf8;
          targetOpacity = 1.0;
          break;
        case 'SPEAKING':
          rotSpeed = 1.2;
          targetColor = 0x67e8f9;
          targetOpacity = 0.95;
          break;
        case 'EXECUTING':
          rotSpeed = 1.8;
          targetColor = 0x38bdf8;
          targetOpacity = 1.0;
          break;
        case 'ERROR':
          rotSpeed = 0.3;
          targetColor = 0xff3366;
          targetOpacity = 0.7;
          break;
        case 'OFFLINE':
          rotSpeed = 0.05;
          targetColor = 0x475569;
          targetOpacity = 0.35;
          break;
        case 'IDLE':
        default:
          rotSpeed = 0.45;
          targetColor = 0x00f0ff;
          targetOpacity = 0.8;
          break;
      }

      // Smooth color transitions
      particleMaterial.color.setHex(targetColor);
      innerSphereMat.color.setHex(targetColor);
      middleTorusMat.color.setHex(targetColor);
      outerRingMat.color.setHex(targetColor);
      bladeMat.color.setHex(targetColor);

      // Rotations
      particles.rotation.y = elapsedTime * rotSpeed * 0.5;
      particles.rotation.x = Math.sin(elapsedTime * 0.3) * 0.2;

      innerSphere.rotation.y = -elapsedTime * rotSpeed * 0.8;
      middleTorus.rotation.z = elapsedTime * rotSpeed * 0.6;
      middleTorus.rotation.x = Math.sin(elapsedTime * 0.5) * 0.3;

      outerRing.rotation.z = -elapsedTime * rotSpeed * 0.35;
      bladeGroup.rotation.z = elapsedTime * rotSpeed * 0.6;

      // Audio / Pulsing Scale
      const scaleMultiplier = 1 + Math.sin(elapsedTime * 2.5) * 0.03 + (currentStatus === 'SPEAKING' ? audioPulse * 0.15 : 0);
      coreGroup.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);

      // Particle Displacement
      const posArray = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];
        const oz = originalPositions[i * 3 + 2];
        const jitter = Math.sin(elapsedTime * 3 + i) * (currentStatus === 'THINKING' ? 0.05 : 0.02);

        posArray[i * 3] = ox * (1 + jitter);
        posArray[i * 3 + 1] = oy * (1 + jitter);
        posArray[i * 3 + 2] = oz * (1 + jitter);
      }
      particleGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      innerSphereGeo.dispose();
      innerSphereMat.dispose();
      middleTorusGeo.dispose();
      middleTorusMat.dispose();
      outerRingGeo.dispose();
      outerRingMat.dispose();
      bladeGeo.dispose();
      bladeMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      onClick={onCoreClick}
      className={`relative cursor-pointer flex items-center justify-center select-none ${className}`}
      title={`J.A.R.V.I.S. Core [${status}] — Click to toggle status`}
      role="region"
      aria-label={`J.A.R.V.I.S. Core in ${status} state`}
    >
      {/* HUD overlay ring graphic */}
      <div className="absolute inset-0 rounded-full border border-cyan-500/20 pointer-events-none animate-pulse-glow" />
      <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400/30 pointer-events-none" />
      
      {/* State badge overlay */}
      <div className="absolute bottom-2 px-3 py-0.5 rounded-full text-[10px] tracking-widest font-mono font-semibold bg-black/70 border border-cyan-400/30 text-cyan-300 shadow-lg">
        SYS.STATE: {status}
      </div>
    </div>
  );
};
