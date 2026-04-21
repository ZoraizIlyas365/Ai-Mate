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
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>AI assistant online</Text>
          </View>
          <Text style={styles.title}>Ai Mate</Text>
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
    backgroundColor: '#050B1A',
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0B1529',
    borderBottomColor: '#1E2A42',
    borderBottomWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statusRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  onlineDot: {
    backgroundColor: '#22C55E',
    borderRadius: 4,
    height: 8,
    marginRight: 6,
    width: 8,
  },
  statusText: {
    color: '#8CB4FF',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: '#9FB0CB',
    fontSize: 13,
    marginTop: 4,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chatListContent: {
    paddingBottom: 12,
    paddingTop: 14,
  },
  inputContainer: {
    backgroundColor: '#0B1529',
    borderTopColor: '#1E2A42',
    borderTopWidth: 1,
    padding: 12,
  },
});
