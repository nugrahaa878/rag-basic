import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chat = async (message: string, context: string = 'No prior context') => {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        role: "system",
        content: `You are a highly knowledgeable assistant. Your task is to provide answers strictly based on the provided context. 
        Do not include any information or assumptions that are not explicitly present in the context. reply in indonesia.
        If the answer cannot be derived from the context, respond with: "The information is not available in the provided context."
        . This is your context:
      ${context}.`,
      },
      {
        role: "user",
        content: message
      }
    ],
    "model": "mixtral-8x7b-32768",
    "temperature": 1,
    "max_tokens": 1024,
    "top_p": 1,
    "stream": false,
    "stop": null
  });

  return chatCompletion.choices[0].message.content
}