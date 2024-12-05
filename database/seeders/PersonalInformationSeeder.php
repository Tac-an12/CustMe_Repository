<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PersonalInformation;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Http;

class PersonalInformationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();

        foreach ($users as $user) {
          
            $profilePictureName = 'profile_' . Str::random(10) . '.jpg';
            $coverPhotoName = 'cover_' . Str::random(10) . '.jpg';

        
            $profilePictureUrl = 'https://picsum.photos/200/200?random=' . random_int(1, 1000);
            $coverPhotoUrl = 'https://picsum.photos/800/400?random=' . random_int(1, 1000);

            $profilePictureContent = Http::get($profilePictureUrl)->body();
            $coverPhotoContent = Http::get($coverPhotoUrl)->body();

            Storage::disk('public')->put('images/' . $profilePictureName, $profilePictureContent);
            Storage::disk('public')->put('images/' . $coverPhotoName, $coverPhotoContent);

            PersonalInformation::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'firstname' => Str::random(10),
                    'lastname' => Str::random(10),
                    'profilepicture' => 'storage/images/' . $profilePictureName,
                    'coverphoto' => 'storage/images/' . $coverPhotoName,
                    'zipcode' => '6016',
                ]
            );
        }
    }
}