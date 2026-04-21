import env from '../config/env';
import { ChatMessage } from '../types/chat';

type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string;
};

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

function toGroqMessages(messages: ChatMessage[]): GroqMessage[] {
  return messages.map(message => ({
    role: message.role,
    content: message.text,
  }));
}

async function mockReply(input: string): Promise<string> {
  const text = input.trim();

  if (!text) {
    return 'Ask me anything about books, recommendations, or quick help.';
  }

  await new Promise<void>(resolve => {
    setTimeout(() => resolve(), 400);
  });

  return `Quick reply: "${text}" sounds great. Add your Groq API key to get real model responses.`;
}

export async function getAssistantReply(
  conversation: ChatMessage[],
): Promise<string> {
  if (!env.GROQ_API_KEY) {
    const latestUserMessage =
      conversation.filter(message => message.role === 'user').at(-1)?.text ?? '';
    return mockReply(latestUserMessage);
  }

  const response = await fetch(GROQ_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: env.GROQ_MODEL,
      temperature: 0.4,
      messages: [
        {
          role: 'system',
          content:
            'You are a fast, helpful in-app assistant for customer support and personal productivity.',
        },
        ...toGroqMessages(conversation),
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Groq API request failed with status ${response.status}`);
  }

  const data = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };

  return data.choices?.[0]?.message?.content?.trim() || 'No response received.';
}
