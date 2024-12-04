export const getEmbedding = async (
  text: string,
  dimensions: number = 1024,
  isQuery: boolean = false // Boolean parameter to indicate query type
) => {
  const requestBody: any = {
    model: 'jina-clip-v2',
    dimensions,
    normalized: true,
    embedding_type: 'float',
    input: [
      {
        text
      },
    ]
  };

  if (isQuery) {
    requestBody.task = 'retrieval.query';
  }

  const req = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.JINA_API_KEY}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!req.ok) {
    throw new Error(`Failed to fetch embeddings: ${req.statusText}`);
  }

  const embeddings = await req.json();
  return embeddings.data[0].embedding;
};
