import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import colors from '../theme/colors';
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
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  userBubble: {
    backgroundColor: colors.brand.success,
    borderBottomRightRadius: 6,
  },
  assistantBubble: {
    backgroundColor: colors.background.assistantBubble,
    borderBottomLeftRadius: 6,
  },
  text: {
    fontSize: 17,
    lineHeight: 24,
  },
  userText: {
    color: colors.text.user,
  },
  assistantText: {
    color: colors.text.assistant,
  },
  attachmentPill: {
    backgroundColor: colors.background.attachmentSurface,
    borderColor: colors.border.attachment,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  attachmentText: {
    color: colors.text.attachment,
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
    backgroundColor: colors.background.attachmentSurface,
    borderColor: colors.border.muted,
    borderRadius: 12,
    borderWidth: 1,
    height: 24,
    justifyContent: 'center',
    marginRight: 8,
    width: 24,
  },
  avatarText: {
    color: colors.text.assistantAvatar,
    fontSize: 9,
    fontWeight: '700',
  },
  timeText: {
    fontSize: 11,
    marginTop: 6,
  },
  userTimeText: {
    color: colors.text.userTimestamp,
    textAlign: 'right',
  },
  assistantTimeText: {
    color: colors.text.muted,
    textAlign: 'left',
  },
});
