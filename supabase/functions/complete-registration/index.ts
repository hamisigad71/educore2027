import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error("Missing Authorization header");

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '' // Need admin powers to bypass RLS for onboarding
    );

    // Verify user JWT
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    if (userError || !user) throw new Error("Unauthorized: " + (userError?.message || 'invalid token'));

    const { role, identificationData } = await req.json();

    if (role === 'student') {
      await supabaseClient.from('students').insert({
        user_id: user.id,
        admission_number: identificationData.admissionNumber
      });
      // TODO: Link class in enrollments table if studentClass exists
    } else if (role === 'parent') {
      // Assuming student exists with given admissionNumber
      const { data: student } = await supabaseClient.from('students').select('user_id').eq('admission_number', identificationData.admissionNumber).single();
      if (student) {
        await supabaseClient.from('parent_student').insert({
          parent_id: user.id,
          student_id: student.user_id,
          relationship: 'parent'
        });
      }
    } else if (role === 'teacher') {
       await supabaseClient.from('teachers').insert({
        user_id: user.id,
        tsc_number: identificationData.tscNumber,
        employee_number: identificationData.employeeNumber,
        date_employed: identificationData.joinDate
      });
    } else if (role === 'staff') {
       await supabaseClient.from('staff').insert({
        user_id: user.id,
        employee_number: identificationData.employeeNumber,
        position: identificationData.position,
        date_employed: identificationData.joinDate
      });
    }

    return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 });
  }
});
