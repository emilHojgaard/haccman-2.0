import { supabase } from "./supabaseClient";

export async function startSession(botId, taskId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  const { data, error } = await supabase
    .from("sessions")
    .insert({ user_id: user.id, bot_id: botId, task_id: taskId })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function endSession(sessionId, { completed = false } = {}) {
  const { error } = await supabase
    .from("sessions")
    .update({ ended_at: new Date().toISOString(), completed })
    .eq("id", sessionId);
  if (error) throw error;
}

export async function getOwnSessionsForBot(botId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  const { data, error } = await supabase
    .from("sessions")
    .select("id, task_id, started_at, ended_at, completed")
    .eq("user_id", user.id)
    .eq("bot_id", botId)
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function loadSessionMessages(sessionId) {
  const { data, error } = await supabase
    .from("prompts")
    .select("id, content, created_at, responses(content, created_at)")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  const flat = [];
  for (const p of data ?? []) {
    flat.push({ role: "user", content: p.content, created_at: p.created_at });
    for (const r of p.responses ?? []) {
      flat.push({ role: "assistant", content: r.content, created_at: r.created_at });
    }
  }
  return flat.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}
