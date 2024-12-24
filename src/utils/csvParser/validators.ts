import { RawCSVLine } from './types';
import { CSV_ERRORS } from './errors';

export function validateParts(parts: string[]): RawCSVLine {
  if (parts.length < 6) {
    throw new Error(CSV_ERRORS.INVALID_FORMAT);
  }

  const answerNumber = parts[parts.length - 1];
  const choices = parts.slice(-5, -1);
  const questionParts = parts.slice(0, -5);

  if (choices.length !== 4) {
    throw new Error(CSV_ERRORS.INVALID_CHOICES);
  }

  return {
    questionText: questionParts.join(','),
    choices,
    answerNumber
  };
}

export function validateAnswer(answer: string): number {
  const num = parseInt(answer, 10);
  if (isNaN(num) || num < 1) {
    throw new Error('正解番号は1以上の整数である必要があります。');
  }
  return num;
}

export function validateQuestion(text: string): string {
  if (!text.includes('(') || !text.includes(')')) {
    throw new Error(CSV_ERRORS.MISSING_PARENTHESES);
  }
  return text.trim();
}