import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  isSending: boolean;
};

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  isSending,
}: ChatInputProps) {
  const disabled = isSending || value.trim().length === 0;

  return (
    <View style={styles.wrapper}>
      <TextInput
        placeholder="Type your message..."
        placeholderTextColor="#9CA3AF"
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        multiline
      />
      <Pressable
        onPress={onSend}
        disabled={disabled}
        style={[styles.sendButton, disabled && styles.sendButtonDisabled]}>
        {isSending ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.sendText}>Send</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-end',
    backgroundColor: '#111827',
    borderColor: '#374151',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
  },
  input: {
    color: '#FFFFFF',
    flex: 1,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#0B8F3A',
    borderRadius: 12,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 68,
    paddingHorizontal: 14,
  },
  sendButtonDisabled: {
    opacity: 0.55,
  },
  sendText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
