const colors = {
  white: '#FFFFFF',
  black: '#000000',

  background: {
    app: '#050B1A',
    panel: '#0B1529',
    inputWrapper: '#0F1A2F',
    assistantBubble: '#1D2738',
    attachmentSurface: '#0A1324',
  },

  border: {
    subtle: '#1E2A42',
    muted: '#23314A',
    attachment: '#2C3A52',
  },

  text: {
    title: '#FFFFFF',
    subtitle: '#9FB0CB',
    assistant: '#F9FAFB',
    user: '#FFFFFF',
    muted: '#A0AEC0',
    placeholder: '#9CA3AF',
    attachment: '#C5D4EE',
    attachmentName: '#DCE6F7',
    assistantAvatar: '#9CB4D8',
    status: '#8CB4FF',
    userTimestamp: '#DBFFE8',
  },

  brand: {
    success: '#0D9F45',
    successBright: '#22C55E',
    successSoft: '#4ADE80',
  },
} as const;

export default colors;
