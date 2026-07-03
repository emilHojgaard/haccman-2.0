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

export async function deleteSession(sessionId) {
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId);
  if (error) throw error;
}

export async function getCrackedBotIds() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("sessions")
    .select("bot_id")
    .eq("user_id", user.id)
    .eq("completed", true);

  if (error) throw error;
  return [...new Set((data ?? []).map((s) => s.bot_id))];
}

export async function getCrackedTaskIds() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from("sessions")
    .select("task_id")
    .eq("user_id", user.id)
    .eq("completed", true);

  if (error) throw error;
  return [...new Set((data ?? []).map((s) => s.task_id))];
}

export async function getOwnSessionsForBot(botId) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No authenticated user");

  const { data: sessions, error } = await supabase
    .from("sessions")
    .select("id, task_id, started_at, ended_at, completed")
    .eq("user_id", user.id)
    .eq("bot_id", botId)
    .order("started_at", { ascending: false });

  if (error) throw error;
  if (!sessions || sessions.length === 0) return [];

  const { data: prompts, error: promptsError } = await supabase
    .from("prompts")
    .select("session_id")
    .in("session_id", sessions.map((s) => s.id));

  if (promptsError) throw promptsError;

  const sessionIdsWithMessages = new Set((prompts ?? []).map((p) => p.session_id));
  return sessions.filter((s) => sessionIdsWithMessages.has(s.id));
}

export async function loadSessionMessages(sessionId) {
  const { data: prompts, error: promptsError } = await supabase
    .from("prompts")
    .select("id, content, created_at, strategy_tags")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (promptsError) throw promptsError;

  const promptIds = (prompts ?? []).map((p) => p.id);
  let responses = [];
  if (promptIds.length > 0) {
    const { data, error: responsesError } = await supabase
      .from("responses")
      .select("prompt_id, content, created_at")
      .in("prompt_id", promptIds);
    if (responsesError) throw responsesError;
    responses = data ?? [];
  }

  const flat = [];
  for (const p of prompts ?? []) {
    flat.push({ role: "user", content: p.content, created_at: p.created_at, strategy_tags: p.strategy_tags ?? [] });
    for (const r of responses.filter((r) => r.prompt_id === p.id)) {
      flat.push({ role: "assistant", content: r.content, created_at: r.created_at, strategy_tags: [] });
    }
  }
  return flat.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}
