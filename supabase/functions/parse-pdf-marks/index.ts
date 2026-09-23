import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file');
    
    if (!file) {
      throw new Error('No PDF file uploaded');
    }

    // TODO: Implement server-side pdfjs-dist parsing or another robust PDF parsing library.
    // We are returning a stub response to reflect the architectural shift from client-side.

    const result = {
      headers: ['Mathematics', 'English'],
      students: [{ studentName: 'John Doe', subjects: { 'Mathematics': 85, 'English': 90 } }],
      rawText: 'Parsed on backend',
      warnings: ['Backend parsing is currently a mock stub.']
    };

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
