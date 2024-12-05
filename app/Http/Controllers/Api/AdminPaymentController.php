<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\UserBalance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AdminPaymentController extends Controller
{
    /**
     * Display a list of incoming payment requests.
     */
    public function index()
    {
        // Get all payments with status 'pending'
        $payments = Payment::where('status', 'pending')->with('user')->get();

        return response()->json([
            'success' => true,
            'data' => $payments
        ]);
    }

    /**
     * Approve a payment request and add balance to the user account.
     */
    public function approve(Request $request, $paymentId)
    {
        // Find the payment by ID
        $payment = Payment::findOrFail($paymentId);

        // Check if the payment is pending
        if ($payment->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Payment is already processed.'
            ], 400);
        }

        // Approve the payment and add the amount to the user's balance
        $payment->status = 'approved';
        $payment->save();

        // Update or create the user balance
        $userBalance = UserBalance::firstOrCreate(
            ['user_id' => $payment->user_id],
            ['balance' => 0]
        );

        $userBalance->balance += $payment->amount;
        $userBalance->save();

        // Notify the user of the balance update (optional)
        // This can be done through events, notifications, or other means as per your setup

        return response()->json([
            'success' => true,
            'message' => 'Payment approved and balance updated.'
        ]);
    }
    public function getUserBalance($userId)
    {
        // Get the balance for the specific user
        $userBalance = UserBalance::where('user_id', $userId)->first();

        if ($userBalance) {
            return response()->json([
                'success' => true,
                'user_balance' => $userBalance->balance
            ]);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'User balance not found.'
            ], 404);
        }
    }
    public function submitPayment(Request $request)
    {
        // Validate incoming request data
        $request->validate([
            'amount' => 'required|numeric',
            'qr_code' => 'required|file|mimes:jpeg,png,jpg,gif,pdf|max:2048', // Adjust file validation as needed
        ]);

        // Store the uploaded QR code image
        $qrCodePath = $request->file('qr_code')->store('public/qr_codes');

        // Create a new payment record
        $payment = new Payment();
        $payment->user_id = auth()->id(); // Assuming you're using auth to get the logged-in user
        $payment->amount = $request->amount;
        $payment->qr_code_url = Storage::url($qrCodePath);
        $payment->status = 'pending'; // Adjust status as needed
        $payment->transaction_id = uniqid(); // You can generate a unique ID for the transaction
        $payment->save();

        // Update user balance (if needed, depending on your business logic)
        $userBalance = UserBalance::where('user_id', auth()->id())->first();
        if ($userBalance) {
            $userBalance->balance += $request->amount;
            $userBalance->save();
        }

        return response()->json([
            'success' => true,
            'message' => 'Payment submitted successfully!',
            'payment' => $payment
        ]);
    }
}
