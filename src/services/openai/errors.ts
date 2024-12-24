export type OpenAIErrorType = 
  | 'API_KEY_MISSING'
  | 'RATE_LIMIT_EXCEEDED'
  | 'API_ERROR'
  | 'NETWORK_ERROR';

export class OpenAIError extends Error {
  constructor(
    public type: OpenAIErrorType,
    public details?: any
  ) {
    super(getErrorMessage(type));
    this.name = 'OpenAIError';
  }
}

function getErrorMessage(type: OpenAIErrorType): string {
  switch (type) {
    case 'API_KEY_MISSING':
      return 'OpenAI APIキーが設定されていません。';
    case 'RATE_LIMIT_EXCEEDED':
      return 'APIリクエストの制限に達しました。しばらく待ってから再試行してください。';
    case 'API_ERROR':
      return 'OpenAI APIでエラーが発生しました。';
    case 'NETWORK_ERROR':
      return 'ネットワークエラーが発生しました。インターネット接続を確認してください。';
  }
}