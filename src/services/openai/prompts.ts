import { Question } from '../../types';

export const systemPrompt = `
あなたは英語教師です。英語の問題の解説を日本語で行ってください。
解説は以下の要素を含め、段階的に表示します：

1. 正誤判定と基本的な説明
2. 文法的なポイント
3. 似たような例文（必要な場合）
4. 他の選択肢が不適切な理由（重要な場合）

説明は簡潔で分かりやすい日本語を使用し、
学習者が理解しやすいように情報を整理してください。
`.trim();

export function createUserPrompt(
  question: Question,
  userAnswer: number,
  isCorrect: boolean
): string {
  const correctChoice = question.choices[question.answer - 1];
  const userChoice = question.choices[userAnswer - 1];

  return `
問題文: ${question.question}
選択肢:
${question.choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n')}
正解: ${question.answer}番 (${correctChoice})
ユーザーの回答: ${userAnswer}番 (${userChoice})
正誤: ${isCorrect ? '正解' : '不正解'}

上記の問題について、段階的に解説を行ってください。
`.trim();
}