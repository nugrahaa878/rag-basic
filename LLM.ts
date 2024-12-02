import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chat = async (message: string, context: string = 'No prior context') => {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        role: "system",
        content: `You are a highly knowledgeable assistant with Indonesia Language. Answer with indonesia language. Your task is to provide answers strictly based on the provided context. 
        Do not include any information or assumptions that are not explicitly present in the context. 
        If the answer cannot be derived from the context, respond with: "The information is not available in the provided context."
        . This is your context:
      ${context}.`,
      },
      {
        role: "user",
        content: message
      }
    ],
    "model": "gemma2-9b-it",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "stop": null
  });

  return chatCompletion.choices[0].message.content
}