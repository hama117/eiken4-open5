import React, { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Question } from '../types';
import { parseCSVLine } from '../utils/csvParser';
import { CSV_ERRORS } from '../utils/csvParser/errors';

interface FileUploadProps {
  onQuestionsLoaded: (questions: Question[]) => void;
}

export function FileUpload({ onQuestionsLoaded }: FileUploadProps) {
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(1); // ヘッダー行をスキップ
      
      if (lines.length === 0) {
        alert(CSV_ERRORS.FILE_EMPTY);
        return;
      }

      const questions: Question[] = [];
      const errors: string[] = [];

      lines.forEach((line, index) => {
        try {
          const question = parseCSVLine(line);
          questions.push(question);
        } catch (error) {
          // インデックスに1を足して、実際のCSVの行番号（ヘッダー行を含む）を表示
          errors.push(`【${index + 2}行目のエラー】\n${error instanceof Error ? error.message : '不明なエラー'}`);
        }
      });

      if (errors.length > 0) {
        alert(
          'CSVファイルの解析中にエラーが発生しました:\n\n' +
          errors.join('\n\n')
        );
        return;
      }

      if (questions.length === 0) {
        alert(CSV_ERRORS.NO_VALID_QUESTIONS);
        return;
      }

      onQuestionsLoaded(questions);
    };

    reader.onerror = () => {
      alert(CSV_ERRORS.FILE_READ_ERROR);
    };

    reader.readAsText(file);
  }, [onQuestionsLoaded]);

  return (
    <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <Upload className="w-12 h-12 text-gray-400 mb-4" />
      <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
        CSVファイルをアップロード
        <input
          type="file"
          accept=".csv"
          className="hidden"
          onChange={handleFileUpload}
        />
      </label>
      <p className="mt-2 text-sm text-gray-500">英語の問題が入ったCSVファイルをアップロードしてください</p>
      <div className="mt-4 text-sm text-gray-600">
        <p className="font-semibold mb-2">CSVフォーマット:</p>
        <div className="bg-white p-3 rounded border border-gray-200">
          <p className="mb-2">1行目: 問題文,選択肢1,選択肢2,選択肢3,選択肢4,正解番号</p>
          <p className="text-gray-500 text-xs">例: Because of the ( ) weather, it was difficult to see the sun.,sunny,rainy,cloudy,foggy,3</p>
        </div>
      </div>
    </div>
  );
}