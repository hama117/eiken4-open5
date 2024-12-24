export function cleanChoiceText(choice: string): string {
  return choice
    .replace(/^["']|["']$/g, '') // 引用符を削除
    .replace(/^\d+[\.)]\s*/, '') // 番号とドットまたは括弧を削除
    .trim();
}

export function cleanQuestionText(text: string): string {
  return text
    .replace(/^["']|["']$/g, '') // 引用符を削除
    .replace(/\s+/g, ' ') // 複数の空白を1つに
    .replace(/\(\s*\)/g, '( )') // 括弧内の空白を正規化
    .trim();
}