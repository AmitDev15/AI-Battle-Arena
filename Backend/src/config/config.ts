import { config } from 'dotenv'

config()

/**
 *Gemini API Key: You can obtain this key from the Google Cloud Console. It is used to authenticate requests to the Gemini API, which provides access to Google's language models.

 *Mistral API Key: This key is obtained from Mistral AI's platform. It is used to authenticate requests to Mistral's API, which provides access to their language models.
 
 *Cohere API Key: This key is obtained from Cohere's platform. It is used to authenticate requests to Cohere's API, which provides access to their language models.
 */
type CONFIG = {
  readonly MISTRAL_API_KEY: string
  readonly COHERE_API_KEY: string
  readonly GEMINI_API_KEY: string
}
export const configs: CONFIG = {
  MISTRAL_API_KEY: process.env.MISTRAL_API_KEY || '',
  COHERE_API_KEY: process.env.COHERE_API_KEY || '',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
}
