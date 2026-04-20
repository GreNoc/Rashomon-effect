export interface LikertQuestion {
  id: string;
  question: string;
  isAttentionCheck?: boolean;
}

export interface LikertScale {
  options: string[];
  leftLabel: string;
  rightLabel: string;
}

export type Reward = "+1" | "-1";

export interface Answer {
  questionId: string;
  value: string;
}