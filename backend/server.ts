import { solver } from "./utils/solver";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const server = Bun.serve({
  port: process.env.PORT || 3001,
  async fetch(req) {
    const url = new URL(req.url);
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (url.pathname === "/api/result") {
      const rollNoParam = url.searchParams.get("rollNo");
      if (!rollNoParam || isNaN(Number(rollNoParam))) {
        return new Response(JSON.stringify({ error: "Invalid or missing rollNo parameter" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      try {
        const result = await solver(Number(rollNoParam));
        if (!result) {
          return new Response(JSON.stringify({ error: "No result found for this roll number" }), {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: "Internal server error" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }
    return new Response("Not Found", { status: 404, headers: corsHeaders });
  },
});

console.log("API server running on http://localhost:3001");