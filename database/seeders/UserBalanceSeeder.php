<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\UserBalance;
use App\Models\User;

class UserBalanceSeeder extends Seeder
{
    public function run()
    {
        // Fetch all users from the database
        $users = User::all();

        // Loop through each user and create a balance record if the user has the role 'user'
        foreach ($users as $user) {
            // Check if the user has the 'user' role
            if ($user->role && $user->role->rolename == 'User') {
                // Create a UserBalance record for users with the 'user' role
                UserBalance::create([
                    'user_id' => $user->id,
                    'balance' => 0,  // You can set an initial balance here
                ]);
            }
        }
    }
}
