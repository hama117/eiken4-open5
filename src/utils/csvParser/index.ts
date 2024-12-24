import { Question } from '../../types';
import { validateParts, validateAnswer, validateQuestion } from './validators';
import { cleanChoiceText, cleanQuestionText } from './cleaners';

export function parseCSVLine(line: string): Question {
  try {
    // 最後の6つの項目を分離（後ろから処理）
    const matches = line.match(/^(.+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)$/);
    if (!matches) {
      throw new Error('CSVの形式が正しくありません。');
    }

    const [, questionText, ...rest] = matches;
    const [choice1, choice2, choice3, choice4, answerStr] = rest;

    // 正解番号の検証
    const answer = validateAnswer(answerStr);

    // 問題文の検証
    const cleanedQuestion = cleanQuestionText(validateQuestion(questionText));

    // 選択肢の処理
    const choices = [choice1, choice2, choice3, choice4].map(cleanChoiceText);

    return {
      question: cleanedQuestion,
      choices,
      answer
    };
  } catch (error) {
    throw error;
  }
}