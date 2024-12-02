import { v4 as uuidv4 } from 'uuid';
import { Index } from "@upstash/vector"

const index = new Index({
  url: process.env.UPSTASH_VECTOR_URL,
  token: process.env.UPSTAH_VECTOR_REST_TOKEN,
})

export const insertVector = async (vector: number[], metadata: any = {}) => {
  await index.upsert({
    id: uuidv4(),
    vector,
    metadata,
  });
}

export const queryVector = async (vector: number[], topK: number = 3) => {
  const results = await index.query({
    vector,
    topK,
    includeVectors: true,
    includeMetadata: true,
  });

  return results
}