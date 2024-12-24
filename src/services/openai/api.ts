import { Question } from '../../types';
import { systemPrompt, createUserPrompt } from './prompts';
import { OpenAIError } from './errors';
import { rateLimiter } from './rateLimiter';
import { openaiConfig } from '../../config/openai';

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
  isCorrect: boolean,
  apiKey: string
): Promise<string> {
  if (!apiKey) {
    throw new OpenAIError('API_KEY_MISSING');
  }

  if (!rateLimiter.canMakeRequest()) {
    throw new OpenAIError('RATE_LIMIT_EXCEEDED');
  }

  try {
    const response = await fetch(`${openaiConfig.baseUrl}${openaiConfig.endpoints.chat}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: openaiConfig.model,
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: createUserPrompt(question, userAnswer, isCorrect)
          }
        ],
        ...openaiConfig.defaultParams
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new OpenAIError(
        response.status === 429 ? 'RATE_LIMIT_EXCEEDED' : 'API_ERROR',
        errorData
      );
    }

    const data: OpenAIResponse = await response.json();
    rateLimiter.recordRequest();
    
    return data.choices[0].message.content;
  } catch (error) {
    if (error instanceof OpenAIError) {
      throw error;
    }
    throw new OpenAIError('NETWORK_ERROR', error);
  }
}