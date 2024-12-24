import { Question } from '../types';
import { config } from '../config/env';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export async function getExplanation(
  question: Question,
  userAnswer: number,
  isCorrect: boolean
): Promise<string> {
  if (!config.openai.apiKey) {
    return getFallbackExplanation(question, isCorrect);
  }

  try {
    const response = await fetch(config.openai.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.openai.apiKey}`,
      },
      body: JSON.stringify({
        model: config.openai.model,
        messages: [
          {
            role: "system",
            content: getSystemPrompt()
          },
          {
            role: "user",
            content: getUserPrompt(question, userAnswer)
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return getFallbackExplanation(question, isCorrect);
  }
}

function getSystemPrompt(): string {
  return `
    あなたは英語教師です。英語の問題の解説を日本語で行ってください。
    解説には以下の要素を含めてください：
    1. 正解の説明
    2. 文法ポイント
    3. 似たような例文（必要な場合）
    4. 他の選択肢が不適切な理由（重要な場合）
    
    説明は簡潔で分かりやすい日本語を使用してください。
  `.trim();
}

function getUserPrompt(question: Question, userAnswer: number): string {
  return `
    問題文: ${question.question}
    選択肢:
    ${question.choices.map((choice, index) => `${index + 1}. ${choice}`).join('\n')}
    正解: ${question.answer}番
    ユーザーの回答: ${userAnswer}番
    
    上記の問題の解説を日本語で行ってください。
  `.trim();
}

function getFallbackExplanation(question: Question, isCorrect: boolean): string {
  return `
    ${isCorrect ? '正解です！🎉' : '残念ながら不正解です。'}
    正解は ${question.answer} です。
    ${isCorrect ? 'とても良くできました！' : 'この問題をよく復習して、次回に活かしましょう！'}
  `.trim();
}