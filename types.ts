
export interface ReferenceMaterial {
  id: string;
  title: string;
  author?: string;
  type: 'book' | 'article' | 'link' | 'video';
  url?: string;
}

export interface QuizResult {
  id: string;
  userName: string;
  disciplineTitle: string;
  score: number;
  total: number;
  percentage: number;
  date: string;
}

export interface Question {
  id: string;
  disciplineId: string;
  theme: string;
  q: string;
  options: string[];
  answer: number;
  explanation: string;
  tag: string;
  image?: string;
  isPractical?: boolean;
}

export interface OsceStation {
  id: string;
  disciplineId: string;
  theme: string;
  title: string;
  scenario: string;
  task: string;
  checklist: string[];
  actionCloud: string[];
  correctOrderIndices: number[];
}

export interface SimulationInfo {
  id: string;
  title: string;
  description: string;
  meta: string;
  icon: string;
  status: 'active' | 'coming-soon' | 'locked';
  themes: string[];
  references?: ReferenceMaterial[];
}

export interface Summary {
  id: string;
  disciplineId: string;
  label: string;
  url: string;
  date: string;
  type: 'summary' | 'script';
  isFolder?: boolean;
}

export type ViewState = 
  | 'home' 
  | 'discipline' 
  | 'quiz-setup' 
  | 'quiz' 
  | 'practice-quiz-setup' 
  | 'practice-quiz' 
  | 'osce-setup'
  | 'osce-quiz'
  | 'admin' 
  | 'summaries-list' 
  | 'scripts-list'
  | 'calculators'
  | 'career-quiz'
  | 'references-view'
  | 'share-material';
