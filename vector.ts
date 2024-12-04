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

    const batchSize = 50;
    for (let i = 0; i < chunkedDocs.length; i += batchSize) {
      const batch = chunkedDocs.slice(i, i + batchSize);

      await Promise.all(batch.map(async (chunk) => {
        try {
          const cleanedText = chunk.pageContent.replace(/[\n\r]+/g, ' ').replace(/\s+/g, ' ').trim();
          const vector = await getEmbedding(cleanedText);

          const metadata = {
            id: uuidv4(),
            source: chunk.metadata.source,
            page: chunk.metadata.loc.pageNumber,
            text: cleanedText,
          };

          await index.upsert({
            id: metadata.id,
            vector,
            metadata,
          });
        } catch (error) {
          console.error(`Failed to insert chunk with ID ${chunk.metadata.id}:`, error);
        }
      }));
    }

    console.log("All chunks have been inserted into the vector db.");
  } catch (error) {
    console.error("Failed to insert chunks into the vector db:", error);
  }
}

