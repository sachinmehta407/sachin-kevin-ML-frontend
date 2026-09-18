import type { AssistantQuestion } from '../types/app';

/** Legacy static FAQ kept for reference; runtime uses MockAssistantService. */
export const assistantQuestions: AssistantQuestion[] = [
  { question: 'Why was XGBoost selected?', answer: 'See MockAssistantService — answers are now grounded in workflow context.' },
  { question: 'Why is SKU difficult to forecast?', answer: 'Ask from Segment & Bias or Dashboard with filters applied.' },
  { question: 'Which categories have the worst accuracy?', answer: 'Ask “Which categories have the worst forecast accuracy?” on the dashboard or bias page.' },
  { question: 'Explain WAPE', answer: 'Ask “Explain forecast accuracy and WAPE for the filtered view.”' },
  { question: 'Why was Deep Learning excluded?', answer: 'Ask that prompt on Model Selection.' },
  { question: 'Compare Default with Experiment A', answer: 'Ask on Experiments or Template Compare.' },
  { question: 'What is missing between templates?', answer: 'Ask on Template Compare while two templates are selected.' },
];
