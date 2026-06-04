'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface DigitalTwinProps {
  isSpeaking: boolean;
  amplitude: number; // 0 to 1
  isMuted?: boolean;
}

export default function DigitalTwin({ isSpeaking, amplitude, isMuted = false }: DigitalTwinProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  // Track mouse movements relative to the window
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1 range
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 6.5);

    // Main Holographic Group
    const avatarGroup = new THREE.Group();
    scene.add(avatarGroup);

    // 1. Face Geometry: Wireframe Sphere/Icosahedron (Holographic mask style)
    const faceGeometry = new THREE.IcosahedronGeometry(1.5, 2);
    // Use a custom points or wireframe material for sci-fi look
    const faceMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5a623,
      wireframe: true,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
    });
    const faceMesh = new THREE.Mesh(faceGeometry, faceMaterial);
    avatarGroup.add(faceMesh);

    // Add glowing vertex nodes
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0xffa000,
      size: 0.05,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
    });
    const facePoints = new THREE.Points(faceGeometry, pointsMaterial);
    avatarGroup.add(facePoints);

    // 2. Eyes: Glowing Cyber Rings
    const eyeGeometry = new THREE.RingGeometry(0.1, 0.16, 16);
    const eyeMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5a623,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.55, 0.35, 1.35);
    avatarGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.55, 0.35, 1.35);
    avatarGroup.add(rightEye);

    // 3. Mouth: BufferGeometry to allow dynamic vertex manipulation
    const mouthPointsCount = 11;
    const mouthPositions = new Float32Array(mouthPointsCount * 3);
    const mouthGeometry = new THREE.BufferGeometry();
    mouthGeometry.setAttribute('position', new THREE.BufferAttribute(mouthPositions, 3));

    const mouthMaterial = new THREE.LineBasicMaterial({
      color: 0xff7a00,
      transparent: true,
      opacity: 0.9,
      linewidth: 3,
      blending: THREE.AdditiveBlending,
    });
    const mouthLine = new THREE.Line(mouthGeometry, mouthMaterial);
    avatarGroup.add(mouthLine);

    // 4. Speaking Indicator Ring
    const indicatorGeometry = new THREE.RingGeometry(1.75, 1.82, 32);
    const indicatorMaterial = new THREE.MeshBasicMaterial({
      color: 0xf5a623,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.1,
      blending: THREE.AdditiveBlending,
    });
    const indicatorRing = new THREE.Mesh(indicatorGeometry, indicatorMaterial);
    indicatorRing.position.set(0, 0, 0);
    avatarGroup.add(indicatorRing);

    // Helper to calculate initial mouth points (idle state)
    const updateMouthVertices = (openAmount: number, time: number) => {
      const positions = mouthGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < mouthPointsCount; i++) {
        const t = i / (mouthPointsCount - 1);
        const x = -0.4 + t * 0.8; // mouth width from -0.4 to 0.4

        // Base smile curve
        const baseSmile = -0.38 - 0.08 * Math.sin(t * Math.PI);

        // Vocal vibration + open factor
        let y = baseSmile;
        if (openAmount > 0) {
          // Open the center points more, vibrate based on time and index
          const openShape = Math.sin(t * Math.PI); // max in center
          const vibration = Math.sin(time * 35 + i * 3) * 0.05 * openAmount;
          y += -openShape * openAmount * 0.28 + vibration;
        }

        const idx = i * 3;
        positions[idx] = x;
        positions[idx + 1] = y;
        positions[idx + 2] = 1.35; // slightly forward on the face sphere
      }
      mouthGeometry.attributes.position.needsUpdate = true;
    };

    // Initialize mouth
    updateMouthVertices(0, 0);

    // Blink variables
    let blinkTimer = 0;
    let blinkDuration = 0;
    let isBlinking = false;

    // Animation Loop
    let time = 0;
    let currentMouthOpen = 0;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      time += 0.015;

      // --- 1. Mouth Lip Sync ---
      let targetMouthOpen = 0;
      if (isSpeaking && !isMuted) {
        if (amplitude > 0) {
          targetMouthOpen = amplitude;
        } else {
          // If speaking but no direct frequency data (e.g. Browser Speech), simulate vocal waves
          targetMouthOpen = 0.25 + 0.45 * Math.abs(Math.sin(time * 18) * Math.cos(time * 9));
        }
      }
      // Smooth interpolation for mouth movements
      currentMouthOpen += (targetMouthOpen - currentMouthOpen) * 0.22;
      updateMouthVertices(currentMouthOpen, time);

      // --- 2. Eye Blinking ---
      blinkTimer += 1;
      if (!isBlinking && blinkTimer > 180 + Math.random() * 120) {
        isBlinking = true;
        blinkDuration = 0;
        blinkTimer = 0;
      }

      if (isBlinking) {
        blinkDuration += 0.15;
        const eyeScaleY = Math.abs(Math.sin(blinkDuration * Math.PI));
        leftEye.scale.y = eyeScaleY;
        rightEye.scale.y = eyeScaleY;
        if (blinkDuration >= 1) {
          isBlinking = false;
          leftEye.scale.y = 1;
          rightEye.scale.y = 1;
        }
      }

      // --- 3. Subtle Head Movement & LookAt Mouse ---
      // Hover floating
      const floatY = Math.sin(time * 1.5) * 0.08;
      const floatX = Math.cos(time * 1.2) * 0.04;
      avatarGroup.position.set(floatX, floatY, 0);

      // Head turn tracking
      const targetRotY = mouseRef.current.x * 0.35;
      const targetRotX = mouseRef.current.y * 0.25;
      avatarGroup.rotation.y += (targetRotY - avatarGroup.rotation.y) * 0.06;
      avatarGroup.rotation.x += (targetRotX - avatarGroup.rotation.x) * 0.06;

      // --- 4. Speaking Indicator Pulse ---
      if (isSpeaking && !isMuted) {
        indicatorRing.visible = true;
        const scaleVal = 1.0 + currentMouthOpen * 0.15 + Math.sin(time * 20) * 0.02;
        indicatorRing.scale.set(scaleVal, scaleVal, scaleVal);
        indicatorMaterial.opacity = 0.2 + currentMouthOpen * 0.3;
        indicatorMaterial.color.setHex(0xff7a00);
      } else {
        // Idle glow pulse
        const scaleVal = 1.0 + Math.sin(time * 2) * 0.03;
        indicatorRing.scale.set(scaleVal, scaleVal, scaleVal);
        indicatorMaterial.opacity = 0.05 + Math.sin(time * 2) * 0.02;
        indicatorMaterial.color.setHex(0xf5a623);
      }

      // Subtle base rotation on the face wireframe for high tech feel
      faceMesh.rotation.y = time * 0.04;
      facePoints.rotation.y = time * 0.04;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
      faceGeometry.dispose();
      faceMaterial.dispose();
      pointsMaterial.dispose();
      eyeGeometry.dispose();
      eyeMaterial.dispose();
      mouthGeometry.dispose();
      mouthMaterial.dispose();
      indicatorGeometry.dispose();
      indicatorMaterial.dispose();
      renderer.dispose();
    };
  }, [isSpeaking, amplitude, isMuted]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(circle, rgba(245,166,35,0.06) 0%, rgba(0,0,0,0) 70%)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
