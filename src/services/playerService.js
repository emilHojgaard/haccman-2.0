import { supabase } from "./supabaseClient";

export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw error;
  return user;
}

export async function getPlayerProfile(userId) {
  if (!userId) return null;
  const { data, error } = await supabase
    .from("players")
    .select("username")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function signOutPlayer() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function signInAnonPlayer() {
  const { data, error } = await supabase.auth.signInAnonymously();
  if (error) throw error;
  return data.user;
}

export async function savePlayerProfile(userId, { username, age }) {
  const { data: existing } = await supabase
    .from("players")
    .select("id")
    .ilike("username", username.trim())
    .neq("id", userId)
    .maybeSingle();

  if (existing) throw new Error("That username is already taken");

  const { error } = await supabase
    .from("players")
    .upsert({ id: userId, username, age });
  if (error) throw error;
}
