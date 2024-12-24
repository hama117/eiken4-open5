export interface Question {
  question: string;
  choices: string[];
  answer: number;
}

export interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  score: number;
  showExplanation: boolean;
  userAnswer: number | null;
  explanation: string;
  quizCompleted: boolean;
  isLoading: boolean; // 追加
}