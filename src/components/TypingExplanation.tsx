import React from 'react';

interface TypingExplanationProps {
  text: string;
}

export function TypingExplanation({ text }: TypingExplanationProps) {
  return (
    <div className="whitespace-pre-line font-mono text-gray-800 leading-relaxed tracking-wide">
      {text}
    </div>
  );
}