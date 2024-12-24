import { useState, useEffect, useCallback, useRef } from 'react';
import { typingConfig } from '../config/typing';
import { getCharacterDelay } from '../utils/typing';

interface UseTypingAnimationReturn {
  displayedText: string;
  cursor: boolean;
  isComplete: boolean;
}

export function useTypingAnimation(text: string): UseTypingAnimationReturn {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cursor, setCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const cursorTimeoutRef = useRef<NodeJS.Timeout>();

  const toggleCursor = useCallback(() => {
    setCursor(prev => !prev);
  }, []);

  const displayNextChar = useCallback(() => {
    if (currentIndex >= text.length) {
      setIsComplete(true);
      return;
    }

    const currentChar = text[currentIndex];
    const nextChar = text[currentIndex + 1];
    const prevChar = currentIndex > 0 ? text[currentIndex - 1] : '';
    
    setDisplayedText(prev => prev + currentChar);
    setCurrentIndex(prev => prev + 1);

    const delay = getCharacterDelay(
      currentChar,
      nextChar,
      prevChar,
      text,
      currentIndex
    );

    timeoutRef.current = setTimeout(displayNextChar, delay);
  }, [currentIndex, text]);

  useEffect(() => {
    // カーソルの点滅
    const cursorInterval = setInterval(toggleCursor, 1000);
    cursorTimeoutRef.current = setTimeout(displayNextChar, typingConfig.speeds.initial);

    return () => {
      clearInterval(cursorInterval);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (cursorTimeoutRef.current) clearTimeout(cursorTimeoutRef.current);
    };
  }, [displayNextChar, toggleCursor]);

  return {
    displayedText,
    cursor,
    isComplete
  };
}