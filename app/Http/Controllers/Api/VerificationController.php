<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Log;

class VerificationController extends Controller
{
    /**
     * Handle both email verification request via URL and code verification.
     */
    public function verify(Request $request)
    {
        // Check if it's a GET request (email link verification)
        if ($request->isMethod('get')) {
            return $this->verifyEmailLink($request);
        }

        // Otherwise, it's a POST request (6-digit code verification)
        return $this->verifyCode($request);
    }

    /**
     * Handle the email verification from the link click.
     */
    protected function verifyEmailLink(Request $request)
    {
        $user = User::findOrFail($request->id);
    
        // Check if the hash matches the user's email hash
        if (!hash_equals((string) $request->hash, sha1($user->getEmailForVerification()))) {
            return response()->json(['error' => 'The email verification link is invalid or expired.'], 400);
        }
    
        // Do not mark the email as verified here. Just send a response to show UI
        return response()->json(['message' => 'Please enter the verification code to complete the email verification.'], 200);
    }
    
    
    /**
     * Handle the 6-digit verification code submission.
     */
    protected function verifyCode(Request $request)
    {
        // Debug: Log incoming request data
        Log::debug('Verification request data:', $request->all());
    
        $user = User::findOrFail($request->id);
    
        // Debug: Log user details after fetching the user
        Log::debug('User found:', ['user_id' => $user->id, 'email_verified_at' => $user->email_verified_at]);
    
        // Validate the verification code here (using the stored code)
        if ($request->verification_code !== $user->verification_code) {
            // Debug: Log failed verification code attempt
            Log::debug('Invalid verification code for user:', ['user_id' => $user->id]);
            return response()->json(['error' => 'Invalid verification code.'], 400);
        }
    
        // Check if the verification code has expired
        if ($user->verification_code_expires_at && now()->gt($user->verification_code_expires_at)) {
            // Debug: Log expired verification code
            Log::debug('Verification code has expired for user:', ['user_id' => $user->id, 'expires_at' => $user->verification_code_expires_at]);
            return response()->json(['error' => 'Verification code has expired.'], 400);
        }
    
        // Mark the user's email as verified once the code is correct
        $user->email_verified_at = true; // Set to true to mark the email as verified
        $user->save();
    
        // Debug: Log successful email verification
        Log::debug('Email successfully verified for user:', ['user_id' => $user->id, 'email_verified_at' => $user->email_verified_at]);
    
        event(new Verified($user));
    
        return response()->json(['message' => 'Your email has been successfully verified!'], 200);
    }
}
    