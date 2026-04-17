import { ChatGoogle } from '@langchain/google'
import { ChatMistralAI } from '@langchain/mistralai'
import { ChatCohere } from '@langchain/cohere'
import { configs } from '../config/config.js'

export const geminiModel = new ChatGoogle({
  apiKey: configs.GEMINI_API_KEY,
  model: 'gemini-2.5-flash',
})

export const mistralModel = new ChatMistralAI({
  apiKey: configs.MISTRAL_API_KEY,
  model: 'mistral-medium-latest',
})

export const cohereModel = new ChatCohere({
  apiKey: configs.COHERE_API_KEY,
  model: 'command-a-03-2025',
})
