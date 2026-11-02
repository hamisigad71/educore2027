import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;

    // Supabase client with service role to manage transactions
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // 1. Check Status Endpoint: GET /mpesa-stkpush?status=CHECKOUT_REQUEST_ID
    const statusQuery = url.searchParams.get("checkoutRequestId");
    if (statusQuery) {
      const { data, error } = await supabaseClient
        .from("fee_transactions")
        .select("id, amount, status, reference_number, mpesa_receipt")
        .eq("reference_number", statusQuery)
        .maybeSingle();

      if (error || !data) {
        return new Response(
          JSON.stringify({ success: false, message: "Transaction not found or pending" }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            status: data.status === "completed" ? "success" : data.status,
            receipt: data.mpesa_receipt,
            amount: data.amount,
          },
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2. Daraja Callback Webhook: POST /mpesa-stkpush?callback=true
    if (url.searchParams.get("callback") === "true") {
      const body = await req.json();
      const stkCallback = body?.Body?.stkCallback;
      if (stkCallback) {
        const checkoutId = stkCallback.CheckoutRequestID;
        const resultCode = stkCallback.ResultCode;

        if (resultCode === 0) {
          const items = stkCallback.CallbackMetadata?.Item || [];
          const receiptItem = items.find((i: any) => i.Name === "MpesaReceiptNumber");
          const receipt = receiptItem?.Value || `MP${Date.now()}`;

          await supabaseClient
            .from("fee_transactions")
            .update({
              status: "completed",
              mpesa_receipt: receipt,
            })
            .eq("reference_number", checkoutId);
        } else {
          await supabaseClient
            .from("fee_transactions")
            .update({
              status: "failed",
            })
            .eq("reference_number", checkoutId);
        }
      }

      return new Response(
        JSON.stringify({ ResultCode: 0, ResultDesc: "Success" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3. Initiate STK Push
    const { amount, phone, studentId, studentName, reference } = await req.json();

    if (!amount || !phone) {
      return new Response(
        JSON.stringify({ success: false, message: "Amount and phone number are required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Format phone: 07XX or +254XX -> 254XX
    let formattedPhone = phone.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "254" + formattedPhone.slice(1);
    } else if (formattedPhone.startsWith("+254")) {
      formattedPhone = formattedPhone.slice(1);
    }

    const shortcode = Deno.env.get("MPESA_SHORTCODE") || "174379";
    const passkey = Deno.env.get("MPESA_PASSKEY") || "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919";
    const consumerKey = Deno.env.get("MPESA_CONSUMER_KEY");
    const consumerSecret = Deno.env.get("MPESA_CONSUMER_SECRET");
    const callbackUrl = Deno.env.get("MPESA_CALLBACK_URL") || `${url.origin}/functions/v1/mpesa-stkpush?callback=true`;

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = btoa(`${shortcode}${passkey}${timestamp}`);

    // Sandbox / Simulation mode if credentials are not configured yet
    const isSimulate = !consumerKey || Deno.env.get("SIMULATE_MPESA") === "true";

    const checkoutRequestId = `ws_CO_${Date.now()}`;

    // Record pending transaction in Supabase
    if (studentId) {
      const { data: fa } = await supabaseClient
        .from("fee_accounts")
        .select("id")
        .eq("student_id", studentId)
        .maybeSingle();

      if (fa) {
        await supabaseClient.from("fee_transactions").insert({
          fee_account_id: fa.id,
          amount: Number(amount),
          payment_method: "mpesa",
          reference_number: checkoutRequestId,
          status: "pending",
        });
      }
    }

    if (isSimulate) {
      // Simulate quick auto-completion in sandbox/demo mode
      setTimeout(async () => {
        const fakeReceipt = `QWE${Math.floor(100000 + Math.random() * 900000)}`;
        await supabaseClient
          .from("fee_transactions")
          .update({
            status: "completed",
            mpesa_receipt: fakeReceipt,
          })
          .eq("reference_number", checkoutRequestId);
      }, 4000);

      return new Response(
        JSON.stringify({
          success: true,
          message: "STK push simulation initiated",
          CheckoutRequestID: checkoutRequestId,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Daraja OAuth for Access Token
    const authCredentials = btoa(`${consumerKey}:${consumerSecret}`);
    const tokenRes = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${authCredentials}`,
        },
      }
    );
    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    // Send STK Push Request to Safaricom
    const stkPayload = {
      BusinessShortCode: shortcode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: String(Math.round(Number(amount))),
      PartyA: formattedPhone,
      PartyB: shortcode,
      PhoneNumber: formattedPhone,
      CallBackURL: callbackUrl,
      AccountReference: reference || "School Fees",
      TransactionDesc: `Fees for ${studentName || "Student"}`,
    };

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(stkPayload),
      }
    );

    const stkData = await stkRes.json();

    if (stkData.ResponseCode === "0") {
      return new Response(
        JSON.stringify({
          success: true,
          message: "STK Push sent successfully to phone",
          CheckoutRequestID: stkData.CheckoutRequestID,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: stkData.errorMessage || "M-Pesa STK push rejected",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, message: error?.message || "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

