'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CinematicLayerProps {
  className?: string;
}

export default function CinematicLayer({ className }: CinematicLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Scene + Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 80);

    // ─── Bokeh particles ───────────────────────────────────────────────────
    const PARTICLE_COUNT = 280;

    // Build a soft, glowing circle texture
    const texSize = 128;
    const texCanvas = document.createElement('canvas');
    texCanvas.width = texSize;
    texCanvas.height = texSize;
    const ctx = texCanvas.getContext('2d')!;
    const gradient = ctx.createRadialGradient(
      texSize / 2,
      texSize / 2,
      0,
      texSize / 2,
      texSize / 2,
      texSize / 2
    );
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(255,200,100,0.9)');
    gradient.addColorStop(0.5, 'rgba(255,160,50,0.4)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(texSize / 2, texSize / 2, texSize / 2, 0, Math.PI * 2);
    ctx.fill();
    const particleTexture = new THREE.CanvasTexture(texCanvas);

    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const scales = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const colors = new Float32Array(PARTICLE_COUNT * 3);

    // Amber palette
    const palette = [
      new THREE.Color('#f5a623'),  // warm amber
      new THREE.Color('#ff7a00'),  // deep orange
      new THREE.Color('#ffe5b4'),  // pale cream
      new THREE.Color('#ffffff'),  // white accent
      new THREE.Color('#ffd080'),  // golden
      new THREE.Color('#4a90d9'),  // cool monitor blue accent
    ];

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Spread across the viewport depth
      positions[i * 3] = (Math.random() - 0.5) * 200;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;

      scales[i] = Math.random() * 3.5 + 0.4;
      phases[i] = Math.random() * Math.PI * 2;
      speeds[i] = Math.random() * 0.4 + 0.1;

      const col = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = col.r;
      colors[i * 3 + 1] = col.g;
      colors[i * 3 + 2] = col.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 4,
      map: particleTexture,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true,
      opacity: 0.55,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // ─── Ambient dust lines ────────────────────────────────────────────────
    const LINE_COUNT = 18;
    const lineMat = new THREE.LineBasicMaterial({
      color: new THREE.Color('#f5a623'),
      transparent: true,
      opacity: 0.04,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < LINE_COUNT; i++) {
      const lGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 60
        ),
        new THREE.Vector3(
          (Math.random() - 0.5) * 200,
          (Math.random() - 0.5) * 120,
          (Math.random() - 0.5) * 60
        ),
      ]);
      scene.add(new THREE.Line(lGeo, lineMat));
    }

    // ─── Mouse tracking ────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      targetMouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouseMove);

    // ─── Resize ────────────────────────────────────────────────────────────
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);

    // ─── Animation loop ────────────────────────────────────────────────────
    let t = 0;
    const pos = geometry.attributes.position as THREE.BufferAttribute;

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.004;

      // Smooth mouse parallax
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.03;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.03;

      camera.position.x = mouseRef.current.x * 4;
      camera.position.y = mouseRef.current.y * 2.5;
      camera.lookAt(0, 0, 0);

      // Float particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const phase = phases[i];
        const speed = speeds[i];
        // Gentle sine drift
        pos.array[i * 3 + 1] += Math.sin(t * speed + phase) * 0.012;
        pos.array[i * 3] += Math.cos(t * speed * 0.7 + phase) * 0.006;
        // Wrap
        if (pos.array[i * 3 + 1] > 60) pos.array[i * 3 + 1] = -60;
        if (pos.array[i * 3 + 1] < -60) pos.array[i * 3 + 1] = 60;
      }
      pos.needsUpdate = true;

      // Slow rotation on the whole particle cloud
      particles.rotation.y = Math.sin(t * 0.06) * 0.08;
      particles.rotation.x = Math.cos(t * 0.05) * 0.04;

      renderer.render(scene, camera);
    };
    animate();

    // ─── Cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 4,
      }}
    />
  );
}
