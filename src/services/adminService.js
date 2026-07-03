import { supabase } from "./supabaseClient";

export async function signInAdmin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

export async function signOutAdmin() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getAllPlayers() {
  const { data, error } = await supabase
    .from("players")
    .select("id, username")
    .order("username", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function getSessionsByUser(userId) {
  const { data, error } = await supabase
    .from("sessions")
    .select("id, bot_id, task_id, started_at, ended_at, completed")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function loadSessionThread(sessionId) {
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
      flat.push({ role: "bot", content: r.content, created_at: r.created_at });
    }
  }
  return flat.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
}
