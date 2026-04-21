import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../types/chat';

type ChatBubbleProps = {
  message: ChatMessage;
};

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  const rowStyle = isUser ? styles.userRow : styles.assistantRow;

  return (
    <View style={[styles.row, rowStyle]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.userBubble : styles.assistantBubble,
        ]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {message.text}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
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
    borderRadius: 16,
    maxWidth: '82%',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userBubble: {
    backgroundColor: '#0B8F3A',
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: '#1F2937',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  assistantText: {
    color: '#F9FAFB',
  },
});
