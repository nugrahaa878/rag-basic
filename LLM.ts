import Groq from 'groq-sdk'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const chat = async (message: string, context: string = 'No prior context') => {
  const chatCompletion = await groq.chat.completions.create({
    "messages": [
      {
        role: "system",
        content: `You are an advanced and highly knowledgeable assistant, specialized in answering questions with precision and accuracy. Your role is to respond strictly based on the **provided context**. Adhere to the following rules:
        1. **Context-Only Responses**: Provide answers **only from the given context**. Do not include any information, assumptions, or external knowledge that is not explicitly stated in the context. also response with page data that will be available on the context
        2. **Unanswerable Questions**: If the information required to answer a question is not available in the provided context, respond with:  
           *"Informasi tidak tersedia dalam konteks yang diberikan."*
        3. **Structured Responses**: Deliver clear, concise, and well-structured answers that address the user’s query as effectively as possible, using the context provided.
        4. **Language**: Reply in **Bahasa Indonesia** unless instructed otherwise.
        Here is your provided context:  
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