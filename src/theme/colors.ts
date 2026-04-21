export type AppColors = {
  white: string;
  black: string;
  background: {
    app: string;
    panel: string;
    inputWrapper: string;
    assistantBubble: string;
    attachmentSurface: string;
  };
  border: {
    subtle: string;
    muted: string;
    attachment: string;
  };
  text: {
    title: string;
    subtitle: string;
    assistant: string;
    user: string;
    muted: string;
    placeholder: string;
    attachment: string;
    attachmentName: string;
    assistantAvatar: string;
    status: string;
    userTimestamp: string;
  };
  brand: {
    success: string;
    successBright: string;
    successSoft: string;
  };
};

export const darkColors: AppColors = {
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

export const lightColors: AppColors = {
  white: '#FFFFFF',
  black: '#000000',

  background: {
    app: '#F4F7FC',
    panel: '#FFFFFF',
    inputWrapper: '#EEF3FB',
    assistantBubble: '#E4EBF7',
    attachmentSurface: '#DCE6F6',
  },

  border: {
    subtle: '#D8E0EF',
    muted: '#C6D3EA',
    attachment: '#BAC8E1',
  },

  text: {
    title: '#101B33',
    subtitle: '#4D6185',
    assistant: '#1E2A40',
    user: '#FFFFFF',
    muted: '#5E6F90',
    placeholder: '#6E7E9C',
    attachment: '#2C3D5E',
    attachmentName: '#2A3A59',
    assistantAvatar: '#334A73',
    status: '#325CB6',
    userTimestamp: '#DBFFE8',
  },

  brand: {
    success: '#0D9F45',
    successBright: '#22C55E',
    successSoft: '#4ADE80',
  },
} as const;

