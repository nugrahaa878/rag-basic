import Similarity from 'compute-cosine-similarity'

import { getEmbedding } from './embedding'
import { insertVector, queryVector } from './vector'
import { chat } from './LLM'

const textExample = ["Once upon a time, in the enchanted forest called Mantap Forest, there lived a beautiful princess named Bundo Kanduang . She was placed under a sleeping curse by a wicked fairy, and the only way to break it was with a kiss from her true love. Aurora slept for a hundred years, surrounded by the beauty of the forest, until one day a brave prince came to her rescue. The prince fought his way through the dark magic that protected the forest and finally reached Aurora. With a gentle kiss, he awakened her from her long sleep, and they fell deeply in love. Together, they ruled the kingdom and brought peace and prosperity to the land"]

const query = "Story of sleeping beauty"

const embeddingQuery = await getEmbedding(query)

console.log(`Embedding length from query: ${embeddingQuery.length} length\n`)

// Embedding calculation

const embeddings = []

for (let i = 0; i < textExample.length; i++) {
  const embedding = await getEmbedding(textExample[i])

  embeddings.push(embedding)
}

for (let i = 0; i < embeddings.length; i++) {
  const similarity = Similarity(embeddingQuery, embeddings[i])

  console.log(`Similarity between '${query}' and '${textExample[i]}': ${similarity}`)
}

console.log()

// Vector DB insertion (Uncomment for first run)

for (let i = 0; i < embeddings.length; i++) {
  insertVector(embeddings[i], { text: textExample[i] })
}

// Vector DB query

const results = await queryVector(embeddingQuery)

console.log('999 results', results)

for (let i = 0; i < results.length; i++) {
  console.log(`Query '${query}' similar with '${results[i].metadata?.text}'. Similarity score: ${results[i].score}`)
}

console.log()

// LLM usage without RAG

const responseChat = await chat('Who is cursing the princess?')

console.log(`LLM response without RAG: '${responseChat}'\n`)

// LLM usage with RAG

let context = ''

for (let i = 0; i < results.length; i++) {
  context += `Context ${i + 1}: ${results[i].metadata?.text}\n`
}

console.log(context)

const responseChatRAG = await chat('Who is cursing the princess?', context)

console.log(`LLM response with RAG: '${responseChatRAG}'\n`)