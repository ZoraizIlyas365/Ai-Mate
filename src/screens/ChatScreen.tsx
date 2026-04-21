import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  DocumentPickerResponse,
  errorCodes,
  isErrorWithCode,
  pick,
  types,
} from '@react-native-documents/picker';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import { getAssistantReply } from '../services/chatService';
import { ChatAttachment, ChatMessage } from '../types/chat';

function createMessage(
  role: ChatMessage['role'],
  text: string,
  attachment?: ChatAttachment,
): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    text,
    createdAt: new Date().toISOString(),
    attachment,
  };
}

const starterMessages: ChatMessage[] = [
  createMessage(
    'assistant',
    'Hi! I am your in-app assistant. Ask for personal help, or app guidance.',
  ),
];

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(starterMessages);
  const [input, setInput] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState<ChatAttachment | null>(null);
  const [isSending, setIsSending] = useState(false);

  const sortedMessages = useMemo(
    () =>
      [...messages].sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : a.createdAt < b.createdAt ? -1 : 0,
      ),
    [messages],
  );

  const handleAttach = async () => {
    try {
      const result: DocumentPickerResponse[] = await pick({
        allowMultiSelection: false,
        type: [types.images, types.pdf, types.doc, types.docx, types.plainText],
      });
      const file = result[0];
      setSelectedAttachment({
        name: file.name ?? 'Attachment',
        uri: file.uri,
        mimeType: file.type,
        size: file.size,
      });
    } catch (error) {
      if (isErrorWithCode(error) && error.code === errorCodes.OPERATION_CANCELED) {
        return;
      }
      Alert.alert('Attachment error', 'Could not select file. Please try again.');
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if ((trimmed.length === 0 && !selectedAttachment) || isSending) {
      return;
    }

    const userMessageText = trimmed || 'Shared an attachment';
    const userMessage = createMessage('user', userMessageText, selectedAttachment ?? undefined);
    const nextConversation = [...messages, userMessage];

    setMessages(nextConversation);
    setInput('');
    setSelectedAttachment(null);
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
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.header}>
          <View style={styles.statusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.statusText}>AI assistant online</Text>
          </View>
          <Text style={styles.title}>Ai Mate</Text>
          <Text style={styles.subtitle}>Personal assistant</Text>
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
            onAttach={handleAttach}
            onClearAttachment={() => setSelectedAttachment(null)}
            selectedAttachment={selectedAttachment}
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
