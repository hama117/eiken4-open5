export const openaiConfig = {
  model: 'gpt-3.5-turbo',
  baseUrl: 'https://api.openai.com/v1',
  endpoints: {
    chat: '/v1/chat/completions'
  },
  defaultParams: {
    temperature: 0.7,
    max_tokens: 500,
  }
} as const;