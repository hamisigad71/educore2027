import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// In-memory store for transactions
const transactions = new Map();

// Helpers
const getMpesaToken = async () => {
    const consumer_key = process.env.MPESA_CONSUMER_KEY || "YOUR_CONSUMER_KEY";
    const consumer_secret = process.env.MPESA_CONSUMER_SECRET || "YOUR_CONSUMER_SECRET";
    const auth = Buffer.from(`${consumer_key}:${consumer_secret}`).toString('base64');

    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: {
                Authorization: `Basic ${auth}`
            }
        });
        return response.data.access_token;
    } catch (error) {
        console.error("Error getting M-Pesa token:", error?.response?.data || error.message);
        throw error;
    }
};

const formatPhoneNumber = (phone) => {
    // Basic format: ensure it starts with 254
    let formatted = phone.replace(/\D/g, ''); // remove non-digits
    if (formatted.startsWith('0')) {
        formatted = '254' + formatted.slice(1);
    } else if (formatted.startsWith('+254')) {
        formatted = formatted.slice(1);
    }
    return formatted;
};

// 1. Initiate STK Push
app.post('/api/stkpush', async (req, res) => {
    const { amount, phone, reference, studentName } = req.body;

    if (!amount || !phone) {
        return res.status(400).json({ success: false, message: "Amount and phone are required" });
    }

    // In a real app, these come from .env
    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://mydomain.com/api/mpesa-callback'; // Must be a public URL

    // Use Ngrok for local testing if you have it: e.g. "https://xxxxxd.ngrok-free.app/api/mpesa-callback"

    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

    const formattedPhone = formatPhoneNumber(phone);

    try {
        // If testing without real credentials, we can simulate success:
        if (process.env.SIMULATE_MPESA === 'true') {
            const fakeRequestId = `ws_CO_${Date.now()}`;
            transactions.set(fakeRequestId, { status: 'pending', amount, phone });

            // Auto finish in 5 seconds
            setTimeout(() => {
                transactions.set(fakeRequestId, { status: 'success', receipt: `QWE${Math.floor(Math.random() * 10000)}` });
            }, 5000);

            return res.json({
                success: true,
                message: "Simulation: STK push sent",
                CheckoutRequestID: fakeRequestId
            });
        }

        const token = await getMpesaToken();

        const stkPayload = {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline", // or "CustomerBuyGoodsOnline" for till
            Amount: amount.toString(),
            PartyA: formattedPhone,
            PartyB: shortcode,
            PhoneNumber: formattedPhone,
            CallBackURL: callbackUrl,
            AccountReference: reference || "School Fees",
            TransactionDesc: `Fees for ${studentName || 'Student'}`
        };

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            stkPayload,
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.ResponseCode === "0") {
            // Save transaction as pending
            transactions.set(response.data.CheckoutRequestID, {
                status: 'pending',
                amount,
                phone: formattedPhone
            });

            res.json({
                success: true,
                message: "STK Push sent successfully",
                CheckoutRequestID: response.data.CheckoutRequestID
            });
        } else {
            res.status(400).json({ success: false, message: response.data.errorMessage });
        }
    } catch (error) {
        console.error("STK Push error", error?.response?.data || error.message);
        res.status(500).json({ success: false, message: "Server error initiating payment." });
    }
});

// 2. Daraja API Callback (Webhook)
app.post('/api/mpesa-callback', (req, res) => {
    console.log("------- MPESA CALLBACK RECEIVED -------");
    console.log(JSON.stringify(req.body, null, 2));

    const body = req.body?.Body?.stkCallback;
    if (!body) return res.status(400).send("Invalid callback");

    const checkoutRequestId = body.CheckoutRequestID;
    const resultCode = body.ResultCode; // 0 means success, otherwise failed/cancelled

    if (resultCode === 0) {
        const meta = body.CallbackMetadata.Item;
        const _amount = meta.find(i => i.Name === 'Amount')?.Value;
        const receipt = meta.find(i => i.Name === 'MpesaReceiptNumber')?.Value;

        transactions.set(checkoutRequestId, {
            status: 'success',
            receipt,
            amount: _amount
        });
        console.log(`Payment Success: ${receipt}`);
    } else {
        transactions.set(checkoutRequestId, {
            status: 'failed',
            message: body.ResultDesc
        });
        console.log(`Payment Failed/Cancelled: ${body.ResultDesc}`);
    }

    // Safaricom expects a rapid success response
    res.json({ "ResultCode": 0, "ResultDesc": "Success" });
});

// 3. Status Polling Endpoint (Used by React App)
app.get('/api/stkpush/status/:checkoutRequestId', (req, res) => {
    const tx = transactions.get(req.params.checkoutRequestId);

    if (!tx) {
        return res.status(404).json({ success: false, message: "Transaction not found" });
    }

    res.json({ success: true, data: tx });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
    console.log("M-Pesa endpoints ready:");
    console.log(" - POST /api/stkpush");
    console.log(" - POST /api/mpesa-callback");
    console.log(" - GET  /api/stkpush/status/:id");
});
