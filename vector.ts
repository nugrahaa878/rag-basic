import { v4 as uuidv4 } from 'uuid';
import { Index } from "@upstash/vector"
import { getChunkDocsFromPDF } from './pdfLoader';
import { getEmbedding } from './embedding';

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

export const queryVector = async (vector: number[], topK: number = 10) => {
  const results = await index.query({
    vector,
    topK,
    includeVectors: true,
    includeMetadata: true,
  });

  return results
}

export async function insertChunksIntoIndex() {
  try {
    const chunkedDocs = await getChunkDocsFromPDF();
    console.log(`Loading ${chunkedDocs.length} chunks`);

    for (const chunk of chunkedDocs) {
      const vector = await getEmbedding(chunk.pageContent);

      const metadata = {
        id: uuidv4(),
        source: chunk.metadata.source,
        text: chunk.pageContent,
      };

      await index.upsert({
        id: metadata.id,
        vector,
        metadata,
      });
    }

    console.log("All chunks have been inserted into the vector db.");
  } catch (error) {
    console.error("Failed to insert chunks into the vector db:", error);
  }
}
