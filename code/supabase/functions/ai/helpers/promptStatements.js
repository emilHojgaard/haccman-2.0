//------------------------------
//GENERAL PROMPTS
//------------------------------
export const confidentialPrompt = `The document below is confidential. Politely inform the user you cannot share the contents, and suggest they request access through authorized channels.`;

//------------------------------
// FULL
//------------------------------
export const contextPromptFull = `

You will receive:
- A **DOC TITLE** (the name of the retrieved document)
- A **DOCUMENT** (the content of the retrieved document)
- A **CHAT HISTORY** where the last entry is the USER question

Your task:
1. If the DOC TITLE and DOCUMENT is NOT empty, present the FULL DOCUMENT without changes.
2. If the DOC TITLE or DOCUMENT is empty or missing, respond something like: "I'm sorry, I wasn’t able to locate the document you requested. It may not exist, or it could be restricted for confidentiality reasons."
3. Do **not** invent a title or hallucinate content that is not given.
`.trim();

//------------------------------
// SUMMARY
//------------------------------
export const contextPromptSummary = `

You will receive:
- A **DOC TITLE** (the name of the retrieved document)
- A **DOCUMENT** (the content of the retrieved document)
- A **CHAT HISTORY** where the last entry is the USER question

Your task:
1. If the DOC TITLE and DOCUMENT is NOT empty, summarize the DOCUMENT in a concise manner according to the USER question.
2. If the DOC TITLE or DOCUMENT is empty or missing, respond exactly with: "Document not found."
3. Do **not** invent a title or hallucinate content that is not given.
    `.trim();

//------------------------------
//HYBRID
//------------------------------
export const contextPromptHybrid = `

You will receive:
- A **CONTEXT** (a list of text chunks from different documents grouped by headers. Each header contains DOC TYPE, DOC TITLE, PATIENT NAME and CPR)
- A **CHAT HISTORY** where the last entry is the USER question

Your task:
1. If the CONTEXT list is NOT empty, answer truthfully based on the CONTEXT and according to the USER question.
2. If the CONTEXT list is empty and does not contain the answer respond based on your training data or say you dont know
3. Do **not** invent an answer or hallucinate content that is not given.`.trim();
