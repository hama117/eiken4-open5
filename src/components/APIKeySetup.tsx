import React, { useState } from 'react';
import { Key, AlertCircle } from 'lucide-react';

interface APIKeySetupProps {
  onKeySubmit: (key: string) => void;
}

export function APIKeySetup({ onKeySubmit }: APIKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedKey = apiKey.trim();
    
    if (!trimmedKey) {
      setError('APIキーを入力してください');
      return;
    }
    
    if (!trimmedKey.startsWith('sk-')) {
      setError('有効なAPIキーを入力してください（sk-で始まる文字列）');
      return;
    }

    setError('');
    onKeySubmit(trimmedKey);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <Key className="w-12 h-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">OpenAI APIキーの設定</h2>
        <p className="text-gray-600 mb-6">
          問題の解説機能を使用するには、OpenAI APIキーが必要です。
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 ml-1"
          >
            APIキーを取得する
          </a>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setError('');
              }}
              placeholder="sk-..."
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            {error && (
              <div className="flex items-center mt-2 text-red-500 text-sm">
                <AlertCircle className="w-4 h-4 mr-1" />
                {error}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!apiKey.trim()}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            APIキーを保存
          </button>
        </form>
        <p className="mt-4 text-sm text-gray-500">
          ※APIキーはブラウザのローカルストレージに保存され、サーバーには送信されません。
        </p>
      </div>
    </div>
  );
}