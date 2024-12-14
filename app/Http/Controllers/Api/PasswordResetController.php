<?php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\CustomResetPassword;

class PasswordResetController extends Controller
{
    // Send reset link
    public function sendResetLinkEmail(Request $request)
{
    // Log the incoming request email
    Log::info('Received password reset request', ['email' => $request->email]);

    $request->validate(['email' => 'required|email']);

    // Log after validation
    Log::info('Email validated', ['email' => $request->email]);

    $status = Password::sendResetLink($request->only('email'), function ($user, $token) use ($request) {
        // Pass both the token and email to the notification
        $user->notify(new CustomResetPassword($token, $request->email));  // Pass token and email to the notification
    });

    // Log the status of sending the reset link
    Log::info('Password reset link status', ['status' => $status]);

    if ($status === Password::RESET_LINK_SENT) {
        return response()->json([
            'message' => 'Password reset link sent!',
        ], 200);
    }

    Log::error('Failed to send password reset link', ['status' => $status, 'email' => $request->email]);

    return response()->json(['message' => 'Unable to send reset link.'], 400);
}

    
    // Show the password reset form (GET request)
        public function showResetForm($token)
        {
            // You can return a view or a response with the token, depending on your needs.
            // If you are using API, you can return a JSON response or a view.
            return response()->json(['token' => $token], 200);
        }

    // Reset the password
    public function reset(Request $request)
    {
        // Log the incoming reset request
        Log::info('Received password reset request', ['email' => $request->email, 'token' => $request->token]);

        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Log after validation
        Log::info('Password reset validation passed', ['email' => $request->email]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                // Log before updating the password
                Log::info('Resetting password for user', ['email' => $user->email]);
                $user->forceFill(['password' => bcrypt($password)])->save();
            }
        );

        // Log the password reset status
        Log::info('Password reset status', ['status' => $status]);

        if ($status === Password::PASSWORD_RESET) {
            // Log success message
            Log::info('Password reset successful', ['email' => $request->email]);

            return response()->json(['message' => 'Password successfully reset!'], 200);
        }

        // Log error if the token or email is invalid
        Log::error('Failed password reset', ['email' => $request->email, 'status' => $status]);

        return response()->json(['message' => 'Invalid token or email.'], 400);
    }
}
