import Config from 'react-native-config';

const env = {
  GROQ_API_KEY: Config.GROQ_API_KEY ?? '',
  GROQ_MODEL: Config.GROQ_MODEL ?? 'llama-3.1-8b-instant',
};

export default env;
