import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChatAttachment } from '../types/chat';

type ChatInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onAttach: () => void;
  onClearAttachment: () => void;
  selectedAttachment: ChatAttachment | null;
  isSending: boolean;
};

export default function ChatInput({
  value,
  onChangeText,
  onSend,
  onAttach,
  onClearAttachment,
  selectedAttachment,
  isSending,
}: ChatInputProps) {
  const disabled = isSending || (value.trim().length === 0 && !selectedAttachment);

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputColumn}>
        {selectedAttachment ? (
          <View style={styles.attachmentPreview}>
            <Text style={styles.attachmentName} numberOfLines={1}>
              {selectedAttachment.name}
            </Text>
            <Pressable onPress={onClearAttachment} hitSlop={8}>
              <Text style={styles.clearAttachment}>Remove</Text>
            </Pressable>
          </View>
        ) : null}
        <TextInput
          placeholder="Type your message..."
          placeholderTextColor="#9CA3AF"
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
        />
      </View>
      <Pressable onPress={onAttach} disabled={isSending} style={styles.attachButton}>
        <Text style={styles.attachText}>Attach</Text>
      </Pressable>
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
  inputColumn: {
    flex: 1,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 16,
    maxHeight: 120,
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  attachmentPreview: {
    alignItems: 'center',
    backgroundColor: '#0A1324',
    borderColor: '#23314A',
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  attachmentName: {
    color: '#DCE6F7',
    flex: 1,
    fontSize: 12,
    marginRight: 8,
  },
  clearAttachment: {
    color: '#8CB4FF',
    fontSize: 12,
    fontWeight: '600',
  },
  attachButton: {
    alignItems: 'center',
    backgroundColor: '#1C2A45',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 72,
    paddingHorizontal: 12,
  },
  attachText: {
    color: '#DCE6F7',
    fontSize: 13,
    fontWeight: '600',
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
