export const CSV_ERRORS = {
  INVALID_FORMAT: 'CSVの形式が正しくありません。問題文、4つの選択肢、正解番号が必要です。',
  INVALID_ANSWER: '正解番号は1以上の整数である必要があります。',
  INVALID_CHOICES: '選択肢は4つ必要です。',
  MISSING_PARENTHESES: '問題文には空欄を示す括弧 ( ) が必要です。',
  FILE_EMPTY: 'CSVファイルが空です。',
  FILE_READ_ERROR: 'ファイルの読み込み中にエラーが発生しました。',
  NO_VALID_QUESTIONS: '有効な問題が見つかりませんでした。CSVファイルの形式を確認してください。',
} as const;