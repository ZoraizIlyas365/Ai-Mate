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
  keepLocalCopy,
  pick,
  types,
} from '@react-native-documents/picker';
import ChatBubble from '../components/ChatBubble';
import ChatInput from '../components/ChatInput';
import { getAssistantReply } from '../services/chatService';
import { useAppTheme } from '../theme/AppThemeProvider';
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
  const { colors } = useAppTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
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
      let resolvedUri = file.uri;

      const localCopy = await keepLocalCopy({
        destination: 'cachesDirectory',
        files: [
          {
            uri: file.uri,
            fileName: file.name ?? `attachment-${Date.now()}`,
          },
        ],
      });
      const copied = localCopy[0];
      if (copied.status === 'success') {
        resolvedUri = copied.localUri;
      }

      setSelectedAttachment({
        name: file.name ?? 'Attachment',
        uri: resolvedUri,
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
        behavior={Platform.select({ ios: 'padding', android: 'height' })}
        keyboardVerticalOffset={0}
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

function createStyles(colors: ReturnType<typeof useAppTheme>['colors']) {
  return StyleSheet.create({
    safeArea: {
      backgroundColor: colors.background.app,
      flex: 1,
    },
    container: {
      flex: 1,
    },
    header: {
      backgroundColor: colors.background.panel,
      borderBottomColor: colors.border.subtle,
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
      backgroundColor: colors.brand.successBright,
      borderRadius: 4,
      height: 8,
      marginRight: 6,
      width: 8,
    },
    statusText: {
      color: colors.text.status,
      fontSize: 12,
      fontWeight: '600',
    },
    title: {
      color: colors.text.title,
      fontSize: 22,
      fontWeight: '700',
    },
    subtitle: {
      color: colors.text.subtitle,
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
      backgroundColor: colors.background.panel,
      borderTopColor: colors.border.subtle,
      borderTopWidth: 1,
      padding: 12,
    },
  });
}
