export async function embedWithOpenAI(text, OPENAI_API_KEY) {
  const r = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "text-embedding-3-small", // 1536 dims
      input: text,
    }),
  });
  if (!r.ok) {
    throw new Error(`embed error: ${r.status} ${await r.text()}`);
  }
  const j = await r.json();
  return j.data[0].embedding; // number[]
}