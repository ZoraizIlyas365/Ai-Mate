import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import { getAssistantReply } from '../services/chatService';
import { ChatMessage } from '../types/chat';

function createMessage(role: ChatMessage['role'], text: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    createdAt: new Date().toISOString(),
  };
}

const starterMessages: ChatMessage[] = [
  createMessage(
    'assistant',
    'Hi! I am your in-app assistant. Ask for customer support, personal help, or app guidance.',
  ),
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : a.createdAt < b.createdAt ? -1 : 0,
      ),
    [messages],
  );

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) {
      return;
    }

    const userMessage = createMessage('user', trimmed);
    const nextConversation = [...messages, userMessage];

    setMessages(nextConversation);
    setInput('');
    setIsSending(true);

    try {
      const reply = await getAssistantReply(nextConversation);
      setMessages(previous => [...previous, createMessage('assistant', reply)]);
    } catch (error) {
      const messageText =
        error instanceof Error ? error.message : 'Unknown error occurred.';
      setMessages(previous => [
        ...previous,
        createMessage(
          'assistant',
          `I could not send your request right now. ${messageText}`,
        ),
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>In-App AI Chat</Text>
          <Text style={styles.subtitle}>Customer support and personal assistant</Text>
        </View>

        <FlatList
          data={sortedMessages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.chatListContent}
          style={styles.chatList}
        />

        <View style={styles.inputContainer}>
          <ChatInput
            value={input}
            onChangeText={setInput}
            onSend={handleSend}
            isSending={isSending}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#030712',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    borderBottomColor: '#1F2937',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  chatListContent: {
    paddingVertical: 12,
  },
  inputContainer: {
    borderTopColor: '#1F2937',
    borderTopWidth: 1,
    padding: 12,
  },
});
