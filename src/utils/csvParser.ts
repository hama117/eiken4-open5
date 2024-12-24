import { Question } from '../types';

export function parseCSVLine(line: string): Question {
  const parts = line.split(',').map(s => s.trim());
  
  if (parts.length < 6) {
    throw new Error('CSVの形式が正しくありません。問題文、4つの選択肢、正解番号が必要です。');
  }

  // 最後の要素を取得して正解番号として解析
  const answerStr = parts[parts.length - 1];
  const answer = parseInt(answerStr, 10);
  
  if (isNaN(answer) || answer < 1 || answer > 4) {
    throw new Error('正解番号は1から4の間である必要があります。');
  }

  // 選択肢を取得（最後から5番目から2番目まで）
  const choices = parts.slice(-5, -1);
  if (choices.length !== 4) {
    throw new Error('選択肢は4つ必要です。');
  }

  // 問題文を再構築（最後の5要素を除いた残りすべて）
  const questionText = parts.slice(0, -5).join(',');
  if (!questionText.includes('(') || !questionText.includes(')')) {
    throw new Error('問題文には空欄を示す括弧 ( ) が必要です。');
  }

  return {
    question: questionText.trim(),
    choices: choices.map(cleanChoiceText),
    answer
  };
}

export function cleanChoiceText(choice: string): string {
  return choice
    .replace(/^["']|["']$/g, '') // 引用符を削除
    .replace(/^\d+\.\s*/, '') // 番号のプレフィックスを削除
    .trim();
}

export function validateCSVLine(line: string): boolean {
  try {
    const parts = line.split(',').map(s => s.trim());
    
    // 最低限必要な要素数（問題文 + 4つの選択肢 + 正解番号）
    if (parts.length < 6) return false;
    
    // 最後の要素が1-4の数字であることを確認
    const answer = parseInt(parts[parts.length - 1], 10);
    if (isNaN(answer) || answer < 1 || answer > 4) return false;
    
    // 問題文に括弧が含まれていることを確認
    const questionText = parts.slice(0, -5).join(',');
    if (!questionText.includes('(') || !questionText.includes(')')) return false;
    
    // 選択肢が4つあることを確認
    const choices = parts.slice(-5, -1);
    if (choices.length !== 4) return false;
    
    return true;
  } catch (error) {
    return false;
  }
}