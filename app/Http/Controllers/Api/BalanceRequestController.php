<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;

use App\Models\UserBalance;
use App\Models\BalanceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BalanceRequestController extends Controller
{
    // Fetch the logged-in user's balance
    public function getUserBalance()
    {
        $user = Auth::user();  // Get the logged-in user
        $balance = UserBalance::where('user_id', $user->id)->sum('amount');  // Sum of all balance amounts for this user
        return response()->json(['balance' => $balance]);
    }

    // User sends a request to add balance
    public function requestBalance(Request $request)
    {
        $user = Auth::user();
        $amount = $request->input('amount');

        // Store balance request (you may want to add validation)
        UserBalance::create([
            'user_id' => $user->id,
            'amount' => $amount,
        ]);

        return response()->json(['message' => 'Balance request sent to admin']);
    }

    // Admin view all pending balance requests
    public function getBalanceRequests()
    {
        $requests = UserBalance::where('status', 'pending')->get();

        return response()->json($requests);
    }

    // Admin approve the balance request
    public function approveBalanceRequest(Request $request)
    {
        $requestId = $request->input('requestId');
        $amount = $request->input('amount');

        // Update balance request to 'approved'
        $balanceRequest = UserBalance::find($requestId);
        $balanceRequest->status = 'approved';
        $balanceRequest->save();

        // Add balance to the user's account
        $userBalance = UserBalance::where('user_id', $balanceRequest->user_id)->first();
        $userBalance->balance += $amount;
        $userBalance->save();

        return response()->json(['message' => 'Balance added successfully']);
    }
}
