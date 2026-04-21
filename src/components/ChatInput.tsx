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
import colors from '../theme/colors';
import AttachmentIcon from '../../assets/svg-icons/attachment.svg';

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
          placeholderTextColor={colors.text.placeholder}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          multiline
          textAlignVertical="top"
        />
      </View>
      <Pressable
        onPress={onAttach}
        disabled={isSending}
        accessibilityLabel="Attach file"
        style={styles.attachButton}>
        <AttachmentIcon
          width={20}
          height={20}
          color={selectedAttachment ? colors.brand.successSoft : colors.text.attachmentName}
        />
      </Pressable>
      <Pressable
        onPress={onSend}
        disabled={disabled}
        style={[styles.sendButton, disabled && styles.sendButtonDisabled]}>
        {isSending ? (
          <ActivityIndicator color={colors.white} size="small" />
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
    backgroundColor: colors.background.inputWrapper,
    borderColor: colors.border.muted,
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
    color: colors.text.title,
    fontSize: 16,
    maxHeight: 120,
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  attachmentPreview: {
    alignItems: 'center',
    backgroundColor: colors.background.attachmentSurface,
    borderColor: colors.border.muted,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  attachmentName: {
    color: colors.text.attachmentName,
    flex: 1,
    fontSize: 12,
    marginRight: 8,
  },
  clearAttachment: {
    color: colors.text.status,
    fontSize: 12,
    fontWeight: '600',
  },
  attachButton: {
    alignItems: 'center',
    borderRadius: 14,
    justifyContent: 'center',
    minHeight: 42,
    minWidth: 50,
    paddingHorizontal: 10,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: colors.brand.success,
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
    color: colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
});
