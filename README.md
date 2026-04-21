# In-App AI Chat Boilerplate (React Native)

This project is a WhatsApp-style AI chat starter for:

- In-app help bot
- Customer support chat
- Personal assistant flows
- Fast response chat UX

The app is scaffolded with a clean `src` structure and currently uses instant mock AI replies until you add your Groq key.

## Project Structure

```txt
src/
  App.tsx
  components/
    ChatBubble.tsx
    ChatInput.tsx
  config/
    env.ts
  screens/
    ChatScreen.tsx
  services/
    chatService.ts
  types/
    chat.ts
```

## Groq Setup

1. Copy `.env.example` to `.env`
2. Set your values in `.env`:

```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant
```

The app now reads values from `.env` via `react-native-config`.
If `GROQ_API_KEY` is empty, it falls back to mock assistant replies.

## Run the App

```sh
npm start
```

In a second terminal:

```sh
npm run android
# or
npm run ios
```

## Next Enhancements

- Persist conversation history (AsyncStorage)
- Typing indicator + streaming tokens
- Suggested prompts / quick actions
- Auth + per-user chat sessions
- Attachments (images, docs) + retrieval
