import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../types/chat';

type ChatBubbleProps = {
  message: ChatMessage;
};

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const rowStyle = isUser ? styles.userRow : styles.assistantRow;
  const isImageAttachment =
    !!message.attachment &&
    (message.attachment.mimeType?.startsWith('image/') ||
      /\.(png|jpe?g|gif|webp|bmp|heic|heif)$/i.test(message.attachment.name));
  const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={[styles.row, rowStyle]}>
      {!isUser && <View style={styles.avatar}><Text style={styles.avatarText}>AI</Text></View>}
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {message.text}
        </Text>
        {message.attachment && isImageAttachment ? (
          <Image
            source={{ uri: message.attachment.uri }}
            style={styles.imageAttachment}
            resizeMode="cover"
          />
        ) : null}
        {message.attachment && !isImageAttachment ? (
          <View style={styles.attachmentPill}>
            <Text style={styles.attachmentText}>Attachment: {message.attachment.name}</Text>
          </View>
        ) : null}
        <Text style={[styles.timeText, isUser ? styles.userTimeText : styles.assistantTimeText]}>
          {timestamp}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    marginVertical: 4,
    width: '100%',
  },
  userRow: {
    justifyContent: 'flex-end',
  },
  assistantRow: {
    justifyContent: 'flex-start',
  },
  bubble: {
    borderRadius: 18,
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  userBubble: {
    backgroundColor: '#0D9F45',
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: '#1D2738',
    borderBottomLeftRadius: 6,
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#F9FAFB',
  },
  attachmentPill: {
    backgroundColor: '#0A1324',
    borderColor: '#2C3A52',
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  attachmentText: {
    color: '#C5D4EE',
    fontSize: 12,
    fontWeight: '500',
  },
  imageAttachment: {
    borderRadius: 12,
    height: 190,
    marginTop: 8,
    width: 220,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#0A1324',
    borderColor: '#23314A',
    borderRadius: 12,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginRight: 8,
    width: 24,
  },
  avatarText: {
    color: '#9CB4D8',
    fontSize: 9,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    marginTop: 6,
  },
  userTimeText: {
    color: '#DBFFE8',
    textAlign: 'right',
  },
  assistantTimeText: {
    color: '#A0AEC0',
    textAlign: 'left',
  },
});
