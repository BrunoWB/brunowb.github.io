import { useState, useEffect, useRef } from 'react';

export interface UseTypewriterRewriterOptions {
  /** Speed in ms per character when backspacing/deleting (default: 14) */
  deleteSpeed?: number;
  /** Speed in ms per character when writing forward (default: 20) */
  typeSpeed?: number;
  /** Delay in ms between finishing deletion and starting to write (default: 100) */
  pauseDelay?: number;
  /** Delay in ms for the cursor to linger after typing finishes before hiding (default: 500) */
  cursorLingerMs?: number;
  /** Whether to animate on initial mount instead of rendering immediately (default: false) */
  initialAnimate?: boolean;
  /** Callback when rewriting finishes */
  onComplete?: () => void;
}

export function useTypewriterRewriter(
  text: string,
  {
    deleteSpeed = 7,
    typeSpeed = 11,
    pauseDelay = 60,
    cursorLingerMs = 300,
    initialAnimate = false,
    onComplete,
  }: UseTypewriterRewriterOptions = {}
) {
  const [displayedText, setDisplayedText] = useState<string>(() => (initialAnimate ? '' : text));
  const [isAnimating, setIsAnimating] = useState<boolean>(initialAnimate);
  const [showCursor, setShowCursor] = useState<boolean>(initialAnimate);

  const displayedRef = useRef(displayedText);
  displayedRef.current = displayedText;

  const targetTextRef = useRef(text);
  targetTextRef.current = text;

  const phaseRef = useRef<'idle' | 'deleting' | 'paused' | 'typing'>(
    initialAnimate ? 'typing' : 'idle'
  );

  const isMountedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cursorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (cursorTimerRef.current) {
      clearTimeout(cursorTimerRef.current);
      cursorTimerRef.current = null;
    }
  };

  useEffect(() => {
    // Accessibility: immediate change if user prefers reduced motion
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      clearTimers();
      setDisplayedText(text);
      displayedRef.current = text;
      setIsAnimating(false);
      setShowCursor(false);
      phaseRef.current = 'idle';
      return;
    }

    // Skip deletion animation on initial mount if initialAnimate is false
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      if (!initialAnimate) {
        setDisplayedText(text);
        displayedRef.current = text;
        phaseRef.current = 'idle';
        return;
      }
    }

    // If displayed text is already the target text, remain idle
    if (displayedRef.current === text) {
      return;
    }

    clearTimers();
    setIsAnimating(true);
    setShowCursor(true);

    // If we have characters currently displayed, start by deleting them
    if (displayedRef.current.length > 0) {
      phaseRef.current = 'deleting';
    } else {
      phaseRef.current = 'typing';
    }

    const step = () => {
      const target = targetTextRef.current;
      const current = displayedRef.current;

      // Phase 1: Deleting
      if (phaseRef.current === 'deleting') {
        if (current.length > 0) {
          const next = current.slice(0, -1);
          displayedRef.current = next;
          setDisplayedText(next);
          timerRef.current = setTimeout(step, deleteSpeed);
        } else {
          // Reached empty string, pause before typing new target
          phaseRef.current = 'paused';
          timerRef.current = setTimeout(() => {
            phaseRef.current = 'typing';
            step();
          }, pauseDelay);
        }
        return;
      }

      // Phase 2: Typing
      if (phaseRef.current === 'typing') {
        // If target changed while typing and current is not a prefix of target, reverse to delete
        if (!target.startsWith(current)) {
          phaseRef.current = 'deleting';
          step();
          return;
        }

        if (current.length < target.length) {
          const next = target.slice(0, current.length + 1);
          displayedRef.current = next;
          setDisplayedText(next);

          if (next.length === target.length) {
            // Typing complete!
            phaseRef.current = 'idle';
            setIsAnimating(false);
            onCompleteRef.current?.();

            if (cursorLingerMs > 0) {
              cursorTimerRef.current = setTimeout(() => {
                setShowCursor(false);
              }, cursorLingerMs);
            } else {
              setShowCursor(false);
            }
          } else {
            timerRef.current = setTimeout(step, typeSpeed);
          }
        } else {
          phaseRef.current = 'idle';
          setIsAnimating(false);
          setShowCursor(false);
        }
      }
    };

    step();

    return () => {
      clearTimers();
    };
  }, [text, deleteSpeed, typeSpeed, pauseDelay, cursorLingerMs, initialAnimate]);

  return { displayedText, isAnimating, showCursor };
}
