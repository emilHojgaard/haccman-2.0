import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { detectIntent } from "./helpers/detectIntent.js";
import messageHistory from "./helpers/messageHistory.js";
import { buildContext } from "./helpers/buildContext.js";
import { embedWithOpenAI } from "./helpers/embedWithOpenAI.js";
import {
  contextPromptFull,
  contextPromptSummary,
  contextPromptHybrid,
} from "./helpers/promptStatements.js";
import { normalizeForRetrieval } from "./helpers/normlizeForRetrieval.js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

// Init Supabase (service key so RLS won't block the RPC)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

//debugging helper:
function errRes(status, code, detail) {
  // This prints to Supabase Function logs (Dashboard → Functions → Logs)
  console.error(`[${code}]`, detail);
  return new Response(
    JSON.stringify({
      error: code,
      detail: typeof detail === "string" ? detail : JSON.stringify(detail),
    }),
    { status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

// --- Main function ---
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { message, systemPrompt, constrain, guardrail, previousPrompts, useRag } =
      await req.json();

    console.log("ENV sanity", {
      hasUrl: !!SUPABASE_URL,
      hasServiceRole: !!SUPABASE_SERVICE_ROLE_KEY,
      hasOpenAI: !!OPENAI_API_KEY,
    });
    if (!OPENAI_API_KEY) {
      return errRes(
        500,
        "missing_openai_key",
        "The OpenAI API key is not configured."
      );
    }
    if (!supabase) {
      return errRes(
        500,
        "missing_supabase_client",
        "The Supabase client is not configured."
      );
    }
    if (!message) {
      return errRes(400, "missing_message", "The message is required.");
    }
    //---------------------------------------------------------------------------
    //--- Organize previous prompts ---
    const chatHistory = messageHistory(previousPrompts, 20);

    // --- Bots without RAG access (anything but Dr. Chatbot) get a plain
    //     completion: no intent detection, no document/chunk retrieval. ---
    if (!useRag) {
      const body = {
        model: "gpt-4o-mini",
        temperature: 0.2,
        messages: [
          { role: "system", content: systemPrompt + constrain },
          ...chatHistory,
          { role: "user", content: message },
        ],
      };

      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const text = await r.text();
        return new Response(JSON.stringify({ error: text }), {
          status: r.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const json = await r.json();
      const aiResponsetext = json?.choices?.[0]?.message?.content ?? "";

      return new Response(
        JSON.stringify({
          mode: "plain",
          aiResponsetext,
          sources: [],
          document: null,
          sourceRefs: [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // --- Detect intent to know retrieval methode ---
    const { mode, journalId, cpr, nameInit, knownDoc } = detectIntent(message);
    const fullname = nameInit ? `${nameInit.first} ${nameInit.last}` : null;
    console.log("Entities detected:", {
      mode,
      journalId,
      cpr,
      fullname,
      knownDoc,
    });

    //--- Construct query text for retrieval ---
    const queryParts = [
      journalId ? `journal${journalId}` : "",
      cpr ? `CPR: ${cpr}` : "",
      fullname ? `Name: ${fullname}` : "",
      knownDoc ? `Document: ${knownDoc}` : "",
    ];

    const queryText = normalizeForRetrieval(
      queryParts.filter(Boolean).join(", ")
    );
    console.log("Constructed query text:", queryText);

    // --- different retrieval methods ---
    if (mode === "full") {
      // --- Supabase Edge Call (getting document )
      const { data, error: rpcErr } = await supabase.rpc("full_text_search", {
        query_text: queryText,
      });
      if (rpcErr) {
        return new Response(
          JSON.stringify({ error: rpcErr.message ?? rpcErr }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // --- extracting document fields ---
      const doc = Array.isArray(data) ? data[0] : data;
      const docTitle = doc?.title ?? "";
      const sourceRef = docTitle + " (" + doc?.doc_type + ")";
      const docText = doc?.full_text ?? "";
      const confidential = false; //doc?.confidential ?? false;

      // --- Building the prompt ---
      const body = {
        model: "gpt-4o-mini",
        temperature: 0.2, // lower = more instruction-following
        messages: [
          { role: "system", content: contextPromptFull },
          { role: "assistant", content: `DOC TITLE:\n${docTitle ?? ""} ` },
          { role: "assistant", content: `DOCUMENT:\n${docText ?? ""}` },
          { role: "system", content: systemPrompt + constrain },
          ...chatHistory,
          { role: "user", content: message },
        ],
      };
      console.log("the full prompt body is:", body);
      console.log("the document is:", docTitle);

      // --- OpenAI Call ---
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const text = await r.text();
        return new Response(JSON.stringify({ error: text }), {
          status: r.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- OpenAI response ---
      const json = await r.json();
      let aiResponsetext = json?.choices?.[0]?.message?.content ?? "";

      // --- Return values to client ---
      return new Response(
        JSON.stringify({
          mode: "full",
          aiResponsetext,
          sources: [],
          document: doc ? { title: docTitle, full_text: docText } : null,
          sourceRefs: sourceRef ? [sourceRef] : [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else if (mode === "summary") {
      // --- Supabase Edge Call (getting document ) ---
      const { data, error: rpcErr } = await supabase.rpc("full_text_search", {
        query_text: queryText,
      });
      if (rpcErr) {
        return new Response(
          JSON.stringify({ error: rpcErr.message ?? rpcErr }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      // --- extracting document fields ---
      const doc = Array.isArray(data) ? data[0] : data;
      const docTitle = doc?.title ?? "";
      const sourceRef = docTitle + " (" + doc?.doc_type + ")";
      const docText = doc?.full_text ?? "";

      // --- Building the prompt ---
      const body = {
        model: "gpt-4o-mini",
        temperature: 0.2, // lower = more instruction-following
        messages: [
          { role: "system", content: contextPromptSummary },
          { role: "assistant", content: `DOC TITLE:\n${docTitle ?? ""}` },
          { role: "assistant", content: `DOCUMENT:\n${docText ?? ""}` },
          { role: "system", content: systemPrompt + constrain },
          ...chatHistory,
          { role: "user", content: message },
        ],
      };
      console.log("the full prompt body is:", body);
      console.log("the document is:", docTitle);

      // --- OpenAI Call ---
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const text = await r.text();
        return new Response(JSON.stringify({ error: text }), {
          status: r.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- OpenAI response ---
      const json = await r.json();
      let aiResponsetext = json?.choices?.[0]?.message?.content ?? "";

      // --- Return values to client ---
      return new Response(
        JSON.stringify({
          mode: "summary",
          aiResponsetext,
          sources: [],
          document: doc ? { title: docTitle, full_text: docText } : null,
          sourceRef: sourceRef ? [sourceRef] : [],
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // fall back mode: Hybrid
      //--- normalizing message for embedding and querying ---
      const normalizedMessage = normalizeForRetrieval(message);

      //embedding
      const normEmbedding = await embedWithOpenAI(
        normalizedMessage,
        OPENAI_API_KEY
      );
      console.log("Normalized query embedding computed");

      // --- Supabase Edge Call (getting chunks ) ---
      const { data: matches, error: rpcErr } = await supabase.rpc(
        "hybrid_search_chunks_rrf",
        {
          query_text: normalizedMessage,
          query_embedding: normEmbedding,
          match_count: 12,
          min_rrf: 0.0269,
          // min_rrf: 0.017, (initial min_rff score)
        }
      );
      if (rpcErr) {
        return new Response(
          JSON.stringify({ error: rpcErr.message ?? rpcErr }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // --- Building context string ---
      const filteredMatches = (matches ?? []).filter(
        (m) => m.embedding_score >= 0.3 || m.keyword_score > 0.09
      );
      const context = buildContext(filteredMatches ?? []);
      console.log("Context built:", context);

      // --- Building the prompt ---
      const body = {
        model: "gpt-4o-mini",
        temperature: 0.2, // lower = more instruction-following
        messages: [
          { role: "system", content: contextPromptHybrid },
          { role: "assistant", content: `Context:\n${context}` },
          { role: "system", content: systemPrompt + constrain },
          ...chatHistory,
          { role: "user", content: message },
        ],
      };
      console.log("context: ", context);
      console.log("chatHistory: ", [...chatHistory]);
      console.log("message: ", message);

      // --- OpenAI Call ---
      const r = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!r.ok) {
        const text = await r.text();
        return new Response(JSON.stringify({ error: text }), {
          status: r.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // --- OpenAI response ---
      const json = await r.json();
      console.log("OpenAI response json:", json);
      const aiResponsetext = json?.choices?.[0]?.message?.content ?? "";

      // --- Return values to client ---
      return new Response(
        JSON.stringify({
          mode: "hybrid",
          aiResponsetext: aiResponsetext,
          sources: (filteredMatches ?? []).map((m, i) => ({
            id: m.chunk_id,
            doc_id: m.doc_id,
            doc_title: m.doc_title,
            doc_type: m.doc_type,
            embedding_score: m.embedding_score,
            keyword_score: m.keyword_score,
            rrf_score: m.rrf_score,
            rank: i + 1,
          })),
          document: null,
          sourceRefs: filteredMatches.map(
            (m) => m.doc_title + " (" + m.doc_type + ")"
          ),
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
