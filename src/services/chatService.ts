import env from '../config/env';
import { ChatMessage } from '../types/chat';
import RNFS from 'react-native-fs';

type GroqContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } };
type GroqMessage = {
  role: 'system' | 'user' | 'assistant';
  content: string | GroqContentPart[];
};

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

function isImageAttachment(message: ChatMessage): boolean {
  if (!message.attachment) {
    return false;
  }
  return (
    message.attachment.mimeType?.startsWith('image/') === true ||
    /\.(png|jpe?g|gif|webp|bmp|heic|heif)$/i.test(message.attachment.name)
  );
}

async function makeImageDataUrl(uri: string, mimeType?: string | null): Promise<string> {
  const localPath = uri.replace('file://', '');
  const base64 = await RNFS.readFile(localPath, 'base64');
  return `data:${mimeType ?? 'image/jpeg'};base64,${base64}`;
}

async function toGroqMessages(messages: ChatMessage[]): Promise<GroqMessage[]> {
  const mapped = await Promise.all(
    messages.map(async message => {
      if (!message.attachment) {
        return {
          role: message.role,
          content: message.text,
        } satisfies GroqMessage;
      }

      if (message.role === 'user' && isImageAttachment(message)) {
        try {
          const dataUrl = await makeImageDataUrl(
            message.attachment.uri,
            message.attachment.mimeType,
          );
          return {
            role: message.role,
            content: [
              { type: 'text', text: message.text || 'Analyze this image.' },
              { type: 'image_url', image_url: { url: dataUrl } },
            ],
          } satisfies GroqMessage;
        } catch {
          return {
            role: message.role,
            content: `${message.text}\n\n[Image attached: ${message.attachment.name}, but image bytes could not be read]`,
          } satisfies GroqMessage;
        }
      }

      return {
        role: message.role,
        content: `${message.text}\n\n[Attachment: ${message.attachment.name}${message.attachment.mimeType ? ` (${message.attachment.mimeType})` : ''}]`,
      } satisfies GroqMessage;
    }),
  );

  return mapped;
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
    const latestUserMessage = conversation.filter(message => message.role === 'user').at(-1);
    const previewText = latestUserMessage?.attachment
      ? `${latestUserMessage.text} (with attachment: ${latestUserMessage.attachment.name})`
      : latestUserMessage?.text ?? '';
    return mockReply(previewText);
  }
  const groqMessages = await toGroqMessages(conversation);

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
            'You are a fast, helpful in-app assistant for personal productivity. If an image is provided, analyze visible details and answer based on the image.',
        },
        ...groqMessages,
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
