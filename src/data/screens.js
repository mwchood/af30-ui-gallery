import { assetPath } from '../assetPath';

export const screenCatalog = [
  {
    id: 'setup',
    label: '首次开机与配网',
    defaultState: 'SET-LOCALE-V01',
    states: [
      'SET-BOOT-V01',
      'SET-BOOT-V02',
      'SET-LOCALE-V01',
      'SET-LOCALE-V02',
      'SET-APP-V01',
      'SET-APP-V02',
      'SET-APP-V03',
      'SET-APP-V05',
      'SET-BOOT-V03',
      'SET-BOOT-V04',
    ],
  },
  {
    id: 'home',
    label: 'Home',
    defaultState: 'HOME-V01-V2',
    states: ['HOME-V01-V2', 'HOME-V02', 'HOME-O01'],
  },
  {
    id: 'ai-plan',
    label: 'AI plan',
    defaultState: 'AI-V05',
    states: ['AI-V01', 'AI-V02', 'AI-V03', 'AI-V04', 'AI-V05', 'AI-E01', 'AI-E02', 'AI-E03'],
  },
  {
    id: 'manual',
    label: 'Manual',
    defaultState: 'MAN-AI-CS06',
    states: ['MAN-AI-CS01', 'MAN-AI-CS02', 'MAN-AI-CS03', 'MAN-AI-CS04', 'MAN-AI-CS05', 'MAN-AI-CS06', 'MAN-AI-CS07'],
  },
  {
    id: 'cooking',
    label: 'Cooking',
    defaultState: 'CWB-V01',
    states: ['CWB-V01', 'CWB-V02', 'CWB-V03', 'CWB-V04', 'CWB-V05', 'CWB-V06', 'CWB-CS01'],
  },
  {
    id: 'recipes',
    label: 'Recipes',
    defaultState: 'REC-P01',
    states: ['REC-P01', 'REC-P02', 'REC-V01', 'REC-V02', 'REC-V03', 'REC-V04', 'REC-V05', 'REC-V06'],
  },
  {
    id: 'preheat',
    label: 'Preheat',
    defaultState: 'PRE-P01',
    states: ['PRE-P01', 'PRE-V01', 'PRE-V02'],
  },
];

export const recipes = [
  { name: 'Crispy Chicken Wings', meta: 'Air Fry · 18 min', image: assetPath('') },
  { name: 'Lemon Herb Chicken', meta: 'Roast · 24 min', image: assetPath('') },
  { name: 'Pepper Potatoes', meta: 'Air Fry · 22 min', image: assetPath('') },
  { name: 'Crispy Vegetables', meta: 'Air Fry · 16 min', image: assetPath('') },
];

export const aiPlanStates = {
  'AI-V01': {
    recognition: 'empty',
    recommendation: 'empty',
    recognitionTitle: 'No food detected',
    recognitionBody: 'Add food, insert the drawer, then select Recognize again.',
  },
  'AI-V02': {
    recognition: 'recognizing',
    recommendation: 'waiting',
    recognitionTitle: 'Recognizing food…',
    recognitionBody: 'Keep the drawer inserted and stable.',
  },
  'AI-V03': {
    recognition: 'candidates',
    recommendation: 'waiting-selection',
    recognitionTitle: 'Detected food',
    recognitionBody: 'The top match is selected automatically.',
  },
  'AI-V04': {
    recognition: 'candidates',
    recommendation: 'generating',
    recognitionTitle: 'Detected food',
    recognitionBody: 'The selected food remains visible while AI creates the cooking plan.',
  },
  'AI-V05': {
    recognition: 'candidates',
    recommendation: 'ready',
    recognitionTitle: 'Detected food',
    recognitionBody: 'Changing the selected food or its details automatically refreshes the plan.',
  },
  'AI-E01': {
    recognition: 'error',
    recommendation: 'waiting',
    recognitionTitle: 'Recognition failed',
    recognitionBody: '',
  },
  'AI-E02': {
    recognition: 'unavailable',
    recommendation: 'unavailable',
    recognitionTitle: 'AI is unavailable',
    recognitionBody: '',
    recommendationTitle: 'AI plan unavailable',
    recommendationBody: '',
  },
  'AI-E03': {
    recognition: 'candidates',
    recommendation: 'error',
    recognitionTitle: 'Detected food',
    recognitionBody: 'Your food details are preserved.',
    recommendationTitle: 'Plan generation failed',
    recommendationBody: '',
  },
};

