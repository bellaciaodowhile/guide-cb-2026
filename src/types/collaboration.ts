export type UserRole = 'collaborator' | 'trusted_collaborator' | 'moderator' | 'superadmin';

export type QuestionStatus = 'pending' | 'approved' | 'rejected';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  approved_questions_count: number;
  created_at: string;
  updated_at: string;
}

export interface CollaborativeQuestion {
  id: string;
  user_id: string;
  chapter: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
  verse_reference: string;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  rejection_reason?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface QuestionSubmission {
  chapter: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: number;
  verse_reference: string;
  difficulty: QuestionDifficulty;
}
