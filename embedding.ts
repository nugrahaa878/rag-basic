export const getEmbedding = async (text: string, dimensions: number = 1024) => {
    const req = await fetch('https://api.jina.ai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.JINA_API_KEY}`
      },
      body: JSON.stringify({
        model: 'jina-clip-v2',
        dimensions,
        normalized: true,
        embedding_type: 'float',
        input: [
          {
            text
          },
        ]
      })
    })
  
    const embeddings = await req.json()
  
    return embeddings.data[0].embedding
  }