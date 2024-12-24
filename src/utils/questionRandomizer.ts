export function shuffleQuestions<T>(questions: T[]): T[] {
  return [...questions].sort(() => Math.random() - 0.5);
}

export function getNextQuestion<T>(questions: T[], usedIndices: Set<number>): [T, number] {
  const availableIndices = Array.from(Array(questions.length).keys())
    .filter(i => !usedIndices.has(i));
  
  if (availableIndices.length === 0) {
    usedIndices.clear();
    return getNextQuestion(questions, usedIndices);
  }

  const randomIndex = Math.floor(Math.random() * availableIndices.length);
  const questionIndex = availableIndices[randomIndex];
  
  return [questions[questionIndex], questionIndex];
}