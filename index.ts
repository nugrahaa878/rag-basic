import { chat } from "./LLM"
import { getEmbedding } from "./embedding"
import { queryVector } from "./vector"


const question = "jelaskan siapa ahmad dan doni, dan apa hubungan mereka"

const embeddingQuery = await getEmbedding(question, 1024, true)

const results = await queryVector(embeddingQuery)

let context = ''

for (let i = 0; i < results.length; i++) {
    context += `Context ${i + 1}: ${results[i].metadata?.text}\n Page: ${results[i].metadata?.page}\n `
}

console.log(context)

const responseChatRAG = await chat(question, context)

console.log(`LLM response with RAG: '${responseChatRAG}'\n`)