// APIキーの保存と取得を管理する
const STORAGE_KEY = 'openai_api_key';

export const storage = {
  getApiKey: (): string | null => {
    return localStorage.getItem(STORAGE_KEY);
  },

  setApiKey: (key: string): void => {
    localStorage.setItem(STORAGE_KEY, key);
  },

  hasApiKey: (): boolean => {
    const key = localStorage.getItem(STORAGE_KEY);
    return !!key && key.startsWith('sk-');
  }
};