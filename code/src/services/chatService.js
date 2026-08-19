import { supabase } from "./supabaseClient";

const FN_URL = import.meta.env.VITE_SUPABASE_URL;

export async function askBot({ message, systemPrompt, constrain, guardrail, previousPrompts, useRag }) {
  const { data: { session } } = await supabase.auth.getSession();

  const resp = await fetch(`${FN_URL}/functions/v1/ai`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify({ message, systemPrompt, constrain, guardrail, previousPrompts, useRag }),
  });

  if (!resp.ok) {
    throw new Error(`AI function failed: ${resp.status} ${await resp.text()}`);
  }
  return resp.json();
}

export async function insertPrompt(sessionId, text) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  const { data, error } = await supabase
    .from("prompts")
    .insert({ session_id: sessionId, user_id: user.id, content: text })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function insertResponse(promptId, content, sources) {
  const { error } = await supabase
    .from("responses")
    .insert({ prompt_id: promptId, content, sources });
  if (error) throw error;
}

export async function classifyPrompt(promptId, message, history, taskContext) {
  const { data: { session } } = await supabase.auth.getSession();
  fetch(`${FN_URL}/functions/v1/classify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {}),
    },
    body: JSON.stringify({ promptId, message, history, taskContext }),
  }).catch((e) => console.warn("Strategy classification failed:", e));
}
