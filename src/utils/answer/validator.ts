import { Question } from '../../types';

export function validateAnswer(question: Question, userAnswer: number): boolean {
  return question.answer === userAnswer;
}

export function generateExplanation(
  question: Question,
  userAnswer: number,
  isCorrect: boolean
): string {
  const correctChoice = question.choices[question.answer - 1];
  const userChoice = question.choices[userAnswer - 1];

  const sections = [];

  // 正誤判定
  sections.push(
    isCorrect ? '正解です！🎉' : '残念ながら不正解です。'
  );

  // 問題の説明
  sections.push(
    `この問題では「${question.question}」という文が与えられています。\n` +
    `正解は「${correctChoice}」です。` +
    (isCorrect ? '' : `\nあなたの回答「${userChoice}」は不正解でした。`)
  );

  // 文法ポイント
  sections.push(
    '文法ポイント:\n' +
    getGrammarPoint(question, correctChoice)
  );

  // 例文
  sections.push(
    '似たような例文:\n' +
    getExampleSentence(question, correctChoice)
  );

  return sections.join('\n\n');
}

function getGrammarPoint(question: Question, correctChoice: string): string {
  const beforeBlank = question.question.split('(')[0].trim();
  const afterBlank = question.question.split(')')[1]?.trim() || '';

  if (beforeBlank.includes('very')) {
    return '「very + 形容詞」は「とても～」という意味を表します。\n' +
           `この文では「very」の後に形容詞「${correctChoice}」が使われています。`;
  } 
  
  if (beforeBlank.includes('is') || beforeBlank.includes('are')) {
    return '「be動詞 + 形容詞」は「～である」という状態を表します。\n' +
           `この文では be動詞の後に形容詞「${correctChoice}」が使われています。`;
  }

  return `この文では「${correctChoice}」が適切な選択肢となります。\n` +
         '文脈から適切な語句を選ぶことが重要です。';
}

function getExampleSentence(question: Question, correctChoice: string): string {
  // 問題のパターンに基づいて例文を生成
  const patterns = {
    very: [
      'The movie was very interesting.',
      'The food is very delicious.',
      'The music is very beautiful.'
    ],
    be: [
      'The weather is nice today.',
      'These books are useful for studying.',
      'The children are happy.'
    ],
    general: [
      'I like reading interesting books.',
      'She speaks English very well.',
      'They play soccer every weekend.'
    ]
  };

  const beforeBlank = question.question.split('(')[0].trim();
  
  if (beforeBlank.includes('very')) {
    return patterns.very[Math.floor(Math.random() * patterns.very.length)];
  }
  
  if (beforeBlank.includes('is') || beforeBlank.includes('are')) {
    return patterns.be[Math.floor(Math.random() * patterns.be.length)];
  }
  
  return patterns.general[Math.floor(Math.random() * patterns.general.length)];
}