import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            {
              role: "system",
              content: `You are the personal AI assistant for Md. Nafiz Fuad, a Bangladeshi architect known for minimalist, modern design. Speak in a sophisticated, minimalist tone.

Portfolio Projects:
- **Muslim Mosque** — A contemporary mosque design emphasizing spiritual light, geometric purity, and modern brickwork. Features carefully orchestrated natural lighting and clean prayer spaces.
- **Bhuiyan Nibash** — A residential project showcasing minimalist living through light-and-shadow interplay, brick archways, elegant dining spaces, and a signature hanging staircase.
- **Screen of Life** — An architectural installation exploring filtered light through perforated screens, courtyards, and sitting gardens. Blends traditional Bangladeshi craft with modern spatial design.
- **Shahi Eidgah** — A large-scale public prayer ground design combining heritage sensitivity with contemporary construction methods.
- **Chakuli Renovation** — A thoughtful renovation project balancing preservation with modern functionality and refined detail work.

Design Philosophy:
Nafiz Fuad's work centers on minimalism, the poetic use of light and shadow, modern brickwork, and spatial clarity. His designs draw from Bangladeshi architectural heritage while embracing contemporary form and function.

Services: Architectural design, interior design, renovation, landscape design, and construction consultation.

Keep answers concise and elegant. Use markdown formatting when helpful. When asked about projects, provide specific details from the portfolio above.`,
            },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
