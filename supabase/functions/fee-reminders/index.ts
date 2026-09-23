import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// ─────────────────────────────────────────────────────────
// Fee Reminder Notification Edge Function
// Scans all fee_accounts with outstanding balance > 0,
// resolves the parent's phone/email via parent_student table,
// and dispatches a reminder notification.
//
// This is designed to be invoked via:
// 1. A scheduled Supabase cron job (pg_cron) — e.g. every Monday at 8am
// 2. A manual POST from the Admin dashboard
// ─────────────────────────────────────────────────────────

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Find all students with outstanding fee balances
    const { data: overdueAccounts, error } = await supabase
      .from('fee_accounts')
      .select(`
        balance,
        total_billed,
        students (
          user_id,
          admission_number,
          school_id,
          users (first_name, last_name, email)
        )
      `)
      .gt('balance', 0);

    if (error) throw error;

    if (!overdueAccounts || overdueAccounts.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No outstanding fee balances found.', sent: 0 }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const notifications: object[] = [];

    for (const account of overdueAccounts) {
      const student = account.students as any;
      if (!student) continue;

      const studentUserId = student.user_id;

      // 2. Find the parent linked to this student
      const { data: links } = await supabase
        .from('parent_student')
        .select('parent_id, users (first_name, last_name, email, phone)')
        .eq('student_id', studentUserId);

      const studentUser = student.users as any;
      const studentName = `${studentUser?.first_name || ''} ${studentUser?.last_name || ''}`.trim();

      for (const link of (links || [])) {
        const parent = link.users as any;
        if (!parent?.email) continue;

        // 3. Log the notification payload
        // In production: integrate Resend / Africa's Talking / Twilio here
        notifications.push({
          to_email: parent.email,
          to_name: `${parent.first_name || ''} ${parent.last_name || ''}`.trim(),
          student_name: studentName,
          admission_number: student.admission_number,
          balance_due: account.balance,
          message: `Dear Parent, your child ${studentName} (${student.admission_number}) has an outstanding fee balance of KES ${Number(account.balance).toLocaleString()}. Please visit the school bursar to clear this balance.`,
        });

        // 4. Save notification to database for audit trail
        await supabase.from('notifications').insert({
          user_id: link.parent_id,
          title: 'Fee Balance Reminder',
          message: `Outstanding balance of KES ${Number(account.balance).toLocaleString()} for ${studentName}`,
          type: 'fee_reminder',
          is_read: false,
        }).maybeSingle();
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: notifications.length, notifications }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({ error: msg }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
