import React, { useEffect, useRef } from 'react';

interface VisualizerProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  isPlaying: boolean;
  color: string;
}

const Visualizer: React.FC<VisualizerProps> = ({ audioRef, isPlaying, color }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audioRef.current || !canvasRef.current) return;

    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        
        // Create source only once
        if (audioRef.current && !sourceRef.current) {
            try {
                 sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
                 sourceRef.current.connect(analyserRef.current);
                 analyserRef.current.connect(audioContextRef.current.destination);
                 analyserRef.current.fftSize = 256;
            } catch(e) {
                console.warn("CORS or Audio Context issue prevents visualization", e);
            }
        }
      }
    };

    // Initialize on user interaction (play)
    if (isPlaying) {
        initAudio();
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }

    const renderFrame = () => {
      if (!canvasRef.current || !analyserRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / bufferLength) * 2.5;
      let barHeight;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        barHeight = dataArray[i] / 2; // Scale down slightly

        // Dynamic Mood Styling
        ctx.fillStyle = color;
        
        // Create a glow effect
        ctx.shadowBlur = 15;
        ctx.shadowColor = color;

        // Draw the bar (bottom up)
        ctx.fillRect(x, height - barHeight, barWidth, barHeight);

        // Draw a "reflection" (top down, smaller opacity)
        ctx.globalAlpha = 0.2;
        ctx.fillRect(x, 0, barWidth, barHeight * 0.5);
        ctx.globalAlpha = 1.0;

        x += barWidth + 1;
      }

      animationRef.current = requestAnimationFrame(renderFrame);
    };

    if (isPlaying) {
      renderFrame();
    } else {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, audioRef, color]);

  return (
    <canvas 
      ref={canvasRef} 
      width={600} 
      height={200} 
      className="w-full h-48 rounded-xl opacity-80 transition-opacity duration-500"
    />
  );
};

export default Visualizer;