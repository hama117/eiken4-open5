import React from 'react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onContinue: () => void;
  onReset: () => void;
}

export function QuizResults({ score, totalQuestions, onContinue, onReset }: QuizResultsProps) {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">クイズ完了！</h2>
      <p className="text-xl mb-6">
        あなたのスコア: {score}/{totalQuestions} ({percentage}%)
      </p>
      <div className="space-x-4">
        <button
          onClick={onContinue}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          次の10問に進む
        </button>
        <button
          onClick={onReset}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition-colors"
        >
          新しい問題をアップロード
        </button>
      </div>
    </div>
  );
}