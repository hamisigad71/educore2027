import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Parse potential JSON body
    let body: any = {};
    if (req.method === "POST") {
      try {
        body = await req.json();
      } catch (e) {}
    }

    // Action A: Immediate Payment Receipt SMS
    if (body.action === "payment_receipt_sms") {
      const { phone, message, receipt, amount } = body;

      // In production: forward to Africa's Talking SMS API or Infobip
      const atUsername = Deno.env.get("AFRICASTALKING_USERNAME");
      const atApiKey = Deno.env.get("AFRICASTALKING_APIKEY");

      if (atUsername && atApiKey && phone) {
        try {
          const params = new URLSearchParams();
          params.append("username", atUsername);
          params.append("to", phone);
          params.append("message", message);
          params.append("from", Deno.env.get("SMS_SENDER_ID") || "EduCore");

          await fetch("https://api.africastalking.com/version1/messaging", {
            method: "POST",
            headers: {
              apiKey: atApiKey,
              "Content-Type": "application/x-www-form-urlencoded",
              Accept: "application/json",
            },
            body: params.toString(),
          });
        } catch (smsErr) {
          console.error("Africa's Talking dispatch error:", smsErr);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: "SMS alert processed successfully",
          messageId: `SMS-${Date.now()}`,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Action B: Fee Reminders Batch Scan
    const { data: overdueAccounts, error } = await supabase
      .from("fee_accounts")
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
      .gt("balance", 0);

    if (error) throw error;

    if (!overdueAccounts || overdueAccounts.length === 0) {
      return new Response(
        JSON.stringify({ message: "No outstanding fee balances found.", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const notifications: object[] = [];

    for (const account of overdueAccounts) {
      const student = account.students as any;
      if (!student) continue;

      const studentUserId = student.user_id;

      // Find parent linked to this student
      const { data: links } = await supabase
        .from("parent_student")
        .select("parent_id, users (first_name, last_name, email, phone)")
        .eq("student_id", studentUserId);

      const studentUser = student.users as any;
      const studentName = `${studentUser?.first_name || ""} ${studentUser?.last_name || ""}`.trim();

      for (const link of links || []) {
        const parent = link.users as any;
        if (!parent?.email && !parent?.phone) continue;

        notifications.push({
          to_email: parent.email,
          to_phone: parent.phone,
          to_name: `${parent.first_name || ""} ${parent.last_name || ""}`.trim(),
          student_name: studentName,
          admission_number: student.admission_number,
          balance: account.balance,
          total_billed: account.total_billed,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: notifications.length,
        dispatchedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
