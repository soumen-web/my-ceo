export type WexaChatRole = 'assistant' | 'user';

export interface WexaChatMessage {
  content: string;
  createdAt: number;
  id: string;
  role: WexaChatRole;
}
