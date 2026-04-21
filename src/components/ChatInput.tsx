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
        textAlignVertical="top"
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
    backgroundColor: '#0F1A2F',
    borderColor: '#23314A',
    borderRadius: 18,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 10,
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
    backgroundColor: '#0D9F45',
    borderRadius: 14,
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
