'use client';

import { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isSpeaking: boolean;
  amplitude: number;
  isMuted?: boolean;
  analyser?: AnalyserNode | null;
}

export default function WaveformVisualizer({
  isSpeaking,
  amplitude,
  isMuted = false,
  analyser = null,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set display sizes
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    let dataArray: Uint8Array = new Uint8Array(0);
    if (analyser) {
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    }

    let time = 0;

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      time += 0.08;

      ctx.clearRect(0, 0, width, height);

      // Draw background line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();

      const active = isSpeaking && !isMuted;

      if (active && analyser) {
        // --- 1. Real Audio Waveform ---
        analyser.getByteTimeDomainData(dataArray as any);

        const sliceWidth = width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0; // 0.0 to 2.0
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }
      } else if (active) {
        // --- 2. Simulated Speech Wave ---
        // Sum of multiple sine waves to make a complex, organic wave
        const points = 80;
        const sliceWidth = width / points;
        let x = 0;

        // Modulate height based on simulated or passed amplitude
        const scale = amplitude > 0 ? amplitude : (0.2 + 0.5 * Math.abs(Math.sin(time * 1.5) * Math.cos(time * 0.7)));
        const maxAmp = (height / 2) * 0.85 * scale;

        for (let i = 0; i <= points; i++) {
          const progress = i / points;
          // Apply a bell curve envelope so the wave dies out at the edges
          const envelope = Math.sin(progress * Math.PI);

          // Combination of 3 waves
          const wave1 = Math.sin(progress * Math.PI * 6 - time * 2) * 1.0;
          const wave2 = Math.sin(progress * Math.PI * 14 + time * 3.5) * 0.4;
          const wave3 = Math.cos(progress * Math.PI * 3 + time * 1) * 0.3;

          const y = height / 2 + (wave1 + wave2 + wave3) * maxAmp * envelope;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
      } else {
        // --- 3. Idle Wave (very flat, low frequency noise) ---
        const points = 60;
        const sliceWidth = width / points;
        let x = 0;
        const maxAmp = 1.5; // very tiny movement

        for (let i = 0; i <= points; i++) {
          const progress = i / points;
          const envelope = Math.sin(progress * Math.PI);
          const y = height / 2 + Math.sin(progress * Math.PI * 4 - time * 0.3) * maxAmp * envelope;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }
      }

      // Glow style
      ctx.strokeStyle = active ? 'rgba(245, 166, 35, 0.85)' : 'rgba(245, 166, 35, 0.25)';
      ctx.lineWidth = active ? 2.5 : 1.5;
      ctx.shadowBlur = active ? 10 : 0;
      ctx.shadowColor = '#f5a623';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Reset shadow for other drawings
      ctx.shadowBlur = 0;
    };

    draw();

    // Cleanup
    return () => cancelAnimationFrame(rafRef.current);
  }, [isSpeaking, amplitude, isMuted, analyser]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
