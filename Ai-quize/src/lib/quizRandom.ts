import type { Question } from '../types';

/** Fisher–Yates shuffle (new array) */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Shuffle answer options and keep correctIndex accurate */
export function shuffleQuestionOptions(question: Question): Question {
  const indexed = question.options.map((text, index) => ({ text, index }));
  const shuffled = shuffle(indexed);
  const correctIndex = shuffled.findIndex((o) => o.index === question.correctIndex);

  return {
    ...question,
    options: shuffled.map((o) => o.text),
    correctIndex: correctIndex >= 0 ? correctIndex : 0,
  };
}

/** Randomize question order + each question's A/B/C/D order */
export function randomizeQuiz(questions: Question[]): Question[] {
  return shuffle(questions).map(shuffleQuestionOptions);
}
