export type ChatRole = 'user' | 'assistant';

export type ChatAttachment = {
  name: string;
  uri: string;
  mimeType?: string | null;
  size?: number | null;
};

export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: string;
  attachment?: ChatAttachment;
};
