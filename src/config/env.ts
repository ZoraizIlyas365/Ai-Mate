import Config from 'react-native-config';

const env = {
  GROQ_API_KEY: Config.GROQ_API_KEY ?? '',
  GROQ_MODEL: Config.GROQ_MODEL ?? 'meta-llama/llama-4-scout-17b-16e-instruct',
};

export default env;
