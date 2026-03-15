export type UserRole = 'collaborator' | 'trusted_collaborator' | 'moderator' | 'superadmin';

export type QuestionStatus = 'pending' | 'approved' | 'rejected';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard';

export type NotificationType = 'approved' | 'rejected' | 'question_approved' | 'question_rejected' | 'new_question_pending' | 'message';

export interface User {
  id: string;
  username: string;
  email?: string;
  role: UserRole;
  approved_questions_count: number;
  is_beta: boolean;
  beta_mode: boolean;
  nationality?: string;
  created_at: string;
  updated_at: string;
}

export interface CollaborativeQuestion {
  id: string;
  user_id: string;
  submitted_by: string;
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
  show_author: boolean;
  time_limit: number;
  points: number;
  author?: string;
  author_nationality?: string;
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
  show_author?: boolean;
  time_limit?: number;
  points?: number;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  question_id?: string;
  is_read: boolean;
  created_at: string;
}
