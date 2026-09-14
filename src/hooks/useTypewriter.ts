import { useState, useEffect, useRef } from 'react';

export interface UseTypewriterOptions {
  speed?: number; // ms per character
  delay?: number; // delay before typing starts in ms
  active?: boolean; // whether this item's step is reached
  isSkipped?: boolean; // immediate full display
  onComplete?: () => void;
}

export function useTypewriter(
  text: string,
  {
    speed = 22,
    delay = 0,
    active = true,
    isSkipped = false,
    onComplete,
  }: UseTypewriterOptions = {}
) {
  const [displayText, setDisplayText] = useState<string>(() => (isSkipped ? text : ''));
  const [isDone, setIsDone] = useState<boolean>(isSkipped);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    if (isSkipped) {
      setDisplayText(text);
      setIsTyping(false);
      setIsDone(true);
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
      return;
    }

    if (!active) {
      setDisplayText('');
      setIsTyping(false);
      setIsDone(false);
      completedRef.current = false;
      return;
    }

    // If active and not skipped, run timer
    let charIndex = 0;
    let intervalId: ReturnType<typeof setInterval> | null = null;
    completedRef.current = false;

    const timeoutId = setTimeout(() => {
      setIsTyping(true);
      intervalId = setInterval(() => {
        charIndex += 1;
        if (charIndex >= text.length) {
          setDisplayText(text);
          setIsTyping(false);
          setIsDone(true);
          if (intervalId) clearInterval(intervalId);
          if (!completedRef.current) {
            completedRef.current = true;
            onCompleteRef.current?.();
          }
        } else {
          setDisplayText(text.slice(0, charIndex));
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, active, isSkipped, speed, delay]);

  return { displayText, isTyping, isDone };
}
