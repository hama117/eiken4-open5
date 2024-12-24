import { useState, useCallback } from 'react';
import { Question, QuizState } from '../types';
import { getExplanation } from '../services/openai/api';
import { shuffleQuestions } from '../utils/questionRandomizer';
import { validateAnswer, generateExplanation } from '../utils/answer/validator';
import { delay } from '../utils/delay';

const QUESTIONS_PER_SET = 10;
const INITIAL_QUESTION_DELAY = 1000; // 1秒の遅延

export function useQuizState(apiKey: string) {
  const [state, setState] = useState<QuizState>({
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    showExplanation: false,
    userAnswer: null,
    explanation: '',
    quizCompleted: false,
    isLoading: false,
  });

  const handleQuestionsLoaded = useCallback(async (questions: Question[]) => {
    const shuffledQuestions = shuffleQuestions(questions);
    setState(prev => ({
      ...prev,
      isLoading: true,
    }));

    // 1秒の遅延を追加
    await delay(INITIAL_QUESTION_DELAY);

    setState({
      questions: shuffledQuestions,
      currentQuestionIndex: 0,
      score: 0,
      showExplanation: false,
      userAnswer: null,
      explanation: '',
      quizCompleted: false,
      isLoading: false,
    });
  }, []);

  const handleAnswer = useCallback(async (answer: number) => {
    const currentQuestion = state.questions[state.currentQuestionIndex];
    const isCorrect = validateAnswer(currentQuestion, answer);

    setState(prev => ({
      ...prev,
      userAnswer: answer,
      score: isCorrect ? prev.score + 1 : prev.score,
      showExplanation: true,
    }));

    try {
      const apiExplanation = await getExplanation(currentQuestion, answer, isCorrect, apiKey);
      setState(prev => ({ ...prev, explanation: apiExplanation }));
    } catch (error) {
      const fallbackExplanation = generateExplanation(currentQuestion, answer, isCorrect);
      setState(prev => ({ ...prev, explanation: fallbackExplanation }));
    }
  }, [state.questions, state.currentQuestionIndex, apiKey]);

  const handleNextQuestion = useCallback(() => {
    const nextIndex = state.currentQuestionIndex + 1;
    const isSetComplete = nextIndex % QUESTIONS_PER_SET === 0;

    setState(prev => ({
      ...prev,
      currentQuestionIndex: nextIndex,
      showExplanation: false,
      userAnswer: null,
      explanation: '',
      quizCompleted: isSetComplete,
    }));
  }, [state.currentQuestionIndex]);

  const handleContinue = useCallback(() => {
    setState(prev => ({
      ...prev,
      quizCompleted: false,
    }));
  }, []);

  const handleReset = useCallback(() => {
    setState({
      questions: [],
      currentQuestionIndex: 0,
      score: 0,
      showExplanation: false,
      userAnswer: null,
      explanation: '',
      quizCompleted: false,
      isLoading: false,
    });
  }, []);

  return {
    state,
    handleQuestionsLoaded,
    handleAnswer,
    handleNextQuestion,
    handleContinue,
    handleReset,
  };
}