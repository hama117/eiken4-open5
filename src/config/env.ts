import { storage } from '../services/storage';

export const config = {
  openai: {
    get apiKey() {
      return storage.getApiKey();
    },
    model: 'gpt-3.5-turbo',
    apiUrl: 'https://api.openai.com/v1/chat/completions',
  },
} as const;

// Validate environment variables
if (!storage.hasApiKey()) {
  console.warn('OpenAI API key is not configured. Please set it in the API key setup screen.');
}