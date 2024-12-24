import React, { useState, useCallback, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResults } from './components/QuizResults';
import { APIKeySetup } from './components/APIKeySetup';
import { QuizTabs } from './components/QuizTabs';
import { Question } from './types';
import { useQuizState } from './hooks/useQuizState';
import { QUESTIONS_PER_SET } from './config/constants';

export function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [activeTab, setActiveTab] = useState('questions');
  const {
    state,
    handleQuestionsLoaded,
    handleAnswer,
    handleNextQuestion,
    handleContinue,
    handleReset
  } = useQuizState(apiKey);

  // タイトルを更新する副作用
  useEffect(() => {
    document.title = '英検4級 練習問題';
  }, []);

  const handleApiKeySubmit = useCallback((key: string) => {
    setApiKey(key);
  }, []);

  const renderContent = () => {
    if (!apiKey) {
      return <APIKeySetup onKeySubmit={handleApiKeySubmit} />;
    }

    if (state.questions.length === 0) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <FileUpload onQuestionsLoaded={handleQuestionsLoaded} />
        </div>
      );
    }

    if (state.quizCompleted) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
          <QuizResults
            score={state.score % QUESTIONS_PER_SET}
            totalQuestions={QUESTIONS_PER_SET}
            onContinue={handleContinue}
            onReset={() => {
              setApiKey('');
              handleReset();
            }}
          />
        </div>
      );
    }

    const currentQuestion = state.questions[state.currentQuestionIndex];

    return (
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <header className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-800">英検4級 練習問題</h1>
              <div className="text-sm text-gray-500">
                総問題数: {state.questions.length}問
              </div>
            </div>
            <QuizTabs activeTab={activeTab} onTabChange={setActiveTab} />
          </header>

          <main className="bg-white rounded-lg shadow-md p-6">
            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    問題 {(state.currentQuestionIndex % QUESTIONS_PER_SET) + 1}/{QUESTIONS_PER_SET}
                  </span>
                  <span className="text-lg">
                    スコア: {state.score % QUESTIONS_PER_SET}/{QUESTIONS_PER_SET}
                  </span>
                </div>

                <QuizQuestion
                  question={currentQuestion}
                  userAnswer={state.userAnswer}
                  onAnswer={handleAnswer}
                  showExplanation={state.showExplanation}
                  explanation={state.explanation}
                />

                {state.showExplanation && (
                  <button
                    onClick={handleNextQuestion}
                    className="w-full sm:w-auto bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
                  >
                    次の問題へ
                  </button>
                )}
              </div>
            )}

            {activeTab === 'study' && (
              <div className="text-gray-600">
                <h2 className="text-xl font-semibold mb-4">英検4級 学習ガイド</h2>
                <div className="space-y-4">
                  <section>
                    <h3 className="font-medium text-lg mb-2">空所補充問題の解き方</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li>前後の文脈をよく読む</li>
                      <li>時制や単数・複数の一致に注意</li>
                      <li>品詞（名詞・動詞・形容詞など）を確認</li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="font-medium text-lg mb-2">よく出る文法項目</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li>be動詞と一般動詞の使い分け</li>
                      <li>現在形と過去形</li>
                      <li>助動詞（can, will, must）</li>
                    </ul>
                  </section>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-gray-600">
                <h2 className="text-xl font-semibold mb-4">設定</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">APIキー設定</h3>
                    <button
                      onClick={() => {
                        setApiKey('');
                        handleReset();
                      }}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    >
                      APIキーを再設定
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  };

  return renderContent();
}