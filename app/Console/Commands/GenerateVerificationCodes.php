<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Illuminate\Support\Str;
use Carbon\Carbon;

class GenerateVerificationCodes extends Command
{
    protected $signature = 'generate:verification-codes';
    protected $description = 'Generate verification codes for all users';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $users = User::whereNull('verification_code')->get(); // Only update users without a verification code
        
        foreach ($users as $user) {
            $verificationCode = Str::random(6); // Generate a 6-digit verification code
            $user->verification_code = $verificationCode;
            $user->verification_code_expires_at = Carbon::now()->addYears(100); // Set expiry to 100 years
            $user->save();
            
            $this->info('Generated verification code for user: ' . $user->email);
        }

        $this->info('Verification codes generated for all users.');
    }
}
