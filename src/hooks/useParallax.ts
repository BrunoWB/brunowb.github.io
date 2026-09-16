import { useState, useEffect, useRef, useCallback } from 'react';

export interface ParallaxMotion {
  x: number; // smoothed -1 to 1
  y: number; // smoothed -1 to 1
  scrollY: number; // window scroll offset in px
  isIdle: boolean;
}

interface UseParallaxOptions {
  enabled?: boolean;
  intensity?: number;
  smoothness?: number; // 0.01 to 0.3
  autoDrift?: boolean;
}

export const useParallax = ({
  enabled = true,
  intensity = 1.0,
  smoothness = 0.08,
  autoDrift = true,
}: UseParallaxOptions = {}) => {
  const [motion, setMotion] = useState<ParallaxMotion>({
    x: 0,
    y: 0,
    scrollY: 0,
    isIdle: true,
  });

  const targetRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const idleTimerRef = useRef<number | null>(null);
  const isIdleRef = useRef(true);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Mouse move handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (typeof window === 'undefined') return;
    const width = window.innerWidth;
    const height = window.innerHeight;
    if (width === 0 || height === 0) return;

    // Normalize to -1 ... 1
    const nx = (e.clientX / width - 0.5) * 2;
    const ny = (e.clientY / height - 0.5) * 2;

    targetRef.current = { x: nx, y: ny };
    isIdleRef.current = false;

    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = window.setTimeout(() => {
      isIdleRef.current = true;
    }, 4000);
  }, []);

  // Device orientation (mobile gyroscope) handler
  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    if (e.gamma == null || e.beta == null) return;
    // gamma: left to right (-90 to 90)
    // beta: front to back (-180 to 180, usually ~30-60 held in hand)
    const gx = Math.max(-1, Math.min(1, e.gamma / 30));
    const gy = Math.max(-1, Math.min(1, (e.beta - 45) / 30));

    targetRef.current = { x: gx, y: gy };
    isIdleRef.current = false;
  }, []);

  // Scroll handler
  const handleScroll = useCallback(() => {
    if (typeof window === 'undefined') return;
    scrollRef.current = window.scrollY || window.pageYOffset || 0;
  }, []);

  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
    }

    // Animation loop for smooth lerp
    let running = true;
    const update = () => {
      if (!running) return;

      const now = Date.now();
      const elapsed = (now - startTimeRef.current) / 1000;

      // When idle and autoDrift is on, apply gentle harmonic breathing
      if (isIdleRef.current && autoDrift) {
        const driftX = Math.sin(elapsed * 0.4) * 0.25;
        const driftY = Math.cos(elapsed * 0.3) * 0.18;
        targetRef.current = { x: driftX, y: driftY };
      }

      // Smooth lerp
      const dx = (targetRef.current.x - currentRef.current.x) * smoothness;
      const dy = (targetRef.current.y - currentRef.current.y) * smoothness;

      currentRef.current.x += dx;
      currentRef.current.y += dy;

      setMotion({
        x: currentRef.current.x * intensity,
        y: currentRef.current.y * intensity,
        scrollY: scrollRef.current,
        isIdle: isIdleRef.current,
      });

      animFrameRef.current = requestAnimationFrame(update);
    };

    animFrameRef.current = requestAnimationFrame(update);

    return () => {
      running = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation);
      }
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [enabled, intensity, smoothness, autoDrift, handleMouseMove, handleOrientation, handleScroll]);

  return motion;
};
