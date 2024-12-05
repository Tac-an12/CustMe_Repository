<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PersonalInformation;
use App\Models\PrintingSkill;
use App\Models\Skill;
use App\Models\AboutMe;
use App\Models\UserCertificate;
use App\Models\Portfolio;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Role;
use App\Models\UserSkill;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserApiController extends Controller
{
    protected $roleModel;
    protected $userModel;
    protected $personalInfoModel;
    protected $skill;
    protected $printingSkill;
    protected $aboutMe;
    protected $certificate;
    protected $portfolio;

    function __construct()
    {
        $this->userModel = new User();
        $this->roleModel = new Role();
        $this->personalInfoModel = new PersonalInformation();
        $this->skill = new Skill();
        $this->printingSkill = new PrintingSkill();
        $this->aboutMe = new AboutMe();
        $this->certificate = new UserCertificate();
        $this->portfolio = new Portfolio();
    }

    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (Auth::attempt($credentials)) {
            $user = Auth::user();

            if (!$user->verified) {
                Auth::logout();
                return response()->json(['error' => 'Your account is not verified.'], 403);
            }

            $token = $user->createToken('auth_token')->plainTextToken;

            // Eager load the role relationship
            $user->load('role');

            // Debugging: Log the user and role data
            Log::info('User logged in:', ['user' => $user, 'role' => $user->role, 'token' => $token]);

            return response()->json(['user' => $user, 'token' => $token, 'message' => 'Login successful'], 200);
        }

        return response()->json(['error' => 'Invalid credentials'], 401);
    }

    public function currentUser(Request $request)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $user->load('role', 'personalInformation');
            return response()->json(['user' => $user]);
        }
        return response()->json(['error' => 'Not authenticated'], 401);
    }

    public function logout(Request $request)
    {
        Auth::user()->tokens()->delete();

        return response()->json(['message' => 'Logged out successfully'], 200);
    }

    public function roles()
    {
        return response()->json(['data' => $this->roleModel->getRoles()], 200);
    }

    public function register(Request $request)
    {
        // Debug: Check all incoming request data
        Log::info('Incoming request data:', $request->all());

        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role_id' => 'required|exists:roles,roleid',
            'verified' => 'boolean',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'profilepicture' => 'nullable|string',
            'coverphoto' => 'nullable|string',
            'zipcode' => 'required|string|max:11',
            'bio' => 'nullable|string', // For AboutMe
            'skills' => 'nullable|array', // Array of skill IDs
            'printing_skills' => 'nullable|array', // Array of printing skill IDs
            'certificate.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx,txt', // Add any other types as needed
            'portfolio.*' => 'file|mimes:pdf,jpg,jpeg,png,doc,docx,txt',
        ]);

        if ($validator->fails()) {
            Log::error('Validation errors:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Step 1: Create the User
        $user = $this->userModel->create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role_id' => $request->role_id,
            'verified' => $request->has('verified') ? $request->verified : false,
        ]);
        Log::info('User created successfully with ID:', [$user->id]);

        // Step 2: Create Personal Information
        $this->personalInfoModel->create([
            'user_id' => $user->id,
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'profilepicture' => $request->profilepicture,
            'coverphoto' => $request->coverphoto,
            'zipcode' => $request->zipcode,
        ]);
        Log::info('Personal information created for user ID:', [$user->id]);

        // Step 3: Create AboutMe if bio is provided
        if ($request->filled('bio')) {
            Log::info('Creating AboutMe entry for user ID:', [$user->id]);
            $this->aboutMe->create([
                'user_id' => $user->id,
                'content' => $request->bio,
            ]);
            Log::info('AboutMe entry created successfully for user ID:', [$user->id]);
        }

        // Step 4: Attach General Skills if provided
        if ($request->filled('skills')) {
            Log::info('Attaching skills to user ID:', [$user->id]);
            $user->skills()->attach($request->skills); // This works for BelongsToMany
        }


        // Step 5: Attach Printing Skills if provided
        if ($request->filled('printing_skills')) {
            Log::info('Attaching printing skills to user ID:', [$user->id]);
            $user->printingSkills()->attach($request->printing_skills); // Attaches printing skills to the user
        }

        $this->saveFiles($request, 'certificate', 'certificates', $user->id);
        $this->saveFiles($request, 'portfolio', 'portfolios', $user->id);



        Log::info('User registration completed successfully for user ID:', [$user->id]);
        return response()->json(['message' => 'User registered successfully'], 201);
    }

    public function saveFiles($request, $fileType, $storagePath, $userId)
    {
        if ($request->hasFile($fileType)) {
            Log::info("Saving {$fileType}(s) for user ID:", [$userId]);
            $files = $request->file($fileType); // Get the uploaded files

            // Ensure files are treated as an array
            if (!is_array($files)) {
                $files = [$files]; // Wrap in array if it's a single file
            }

            foreach ($files as $file) {
                $path = $file->store($storagePath, 'public'); // Store in public storage
                $this->{$fileType}->create([
                    'user_id' => $userId,
                    'file_path' => $path,
                    'file_name' => $file->getClientOriginalName(),
                ]);
            }

            Log::info("{$fileType}(s) saved successfully for user ID:", [$userId]);
        }
    }


    public function getUserProfile($id)
    {
        try {
            // Eager load stores with their locations, role, posts, aboutMe, userPrintingSkills, and userSkills
            $user = User::with([
                'personalInformation',
                'stores.location',
                'role',
                'posts.images',
                'aboutMe', // Include aboutMe relationship
                'userPrintingSkills.printingSkill', // Include userPrintingSkills relationship
                'userSkills.skill' // Include userSkills relationship
            ])->findOrFail($id);

            Log::info('User Data:', $user->toArray());

            // Structure the response to include the additional fields
            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'verified' => $user->verified,
                    'role_name' => $user->role->rolename,
                    'personal_information' => $user->personalInformation,
                    'stores' => $user->stores,
                    'posts' => $user->posts,
                    'about_me' => $user->aboutMe, // Add aboutMe to the response
                    'printing_skills' => $user->userPrintingSkills->map(function ($userPrintingSkill) {
                        return $userPrintingSkill->printingSkill;
                    }),
                    'user_skills' => $user->userSkills->map(function ($userSkill) {
                        return $userSkill->skill;
                    }),
                ]
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error fetching user profile:', ['error' => $e->getMessage()]);
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function updateUserProfile(Request $request, $id)
    {
        Log::info('Incoming request data for updating user profile:', [
            'id' => $id,
            'request_data' => $request->all()
        ]);

        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'profilepicture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjusted for image validation
            'coverphoto' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'zipcode' => 'nullable|numeric|digits:11',
        ]);

        if ($validator->fails()) {
            Log::error('Validation errors:', ['errors' => $validator->errors()]);
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::findOrFail($id);

        Log::info('User found, updating profile:', ['user_id' => $user->id]);

        $user->personalInformation()->update([
            'firstname' => $request->firstname,
            'lastname' => $request->lastname,
            'zipcode' => $request->zipcode ?? $user->personalInformation->zipcode,
            'profilepicture' => $user->personalInformation->profilepicture, // Default current value
            'coverphoto' => $user->personalInformation->coverphoto, // Default current value
        ]);

        // Handle file uploads
        if ($request->hasFile('profilepicture')) {
            $profilePicturePath = $request->file('profilepicture')->store('images', 'public');
            $user->personalInformation()->update(['profilepicture' => $profilePicturePath]);
        }

        if ($request->hasFile('coverphoto')) {
            $coverPhotoPath = $request->file('coverphoto')->store('images', 'public');
            $user->personalInformation()->update(['coverphoto' => $coverPhotoPath]);
        }

        Log::info('Profile updated successfully for user:', ['user_id' => $user->id]);

        return response()->json(['message' => 'Profile updated successfully']);
    }


    public function getUsers(Request $request)
    {
        $currentUser = Auth::user();
        $users = User::where('id', '!=', $currentUser->id)
            ->with(['role', 'certificates', 'portfolios']) // Eager load role, certificates, and portfolios
            ->paginate(5);

        return response()->json(['users' => $users]);
    }


    public function acceptUser(Request $request, $userId)
    {
        $user = User::find($userId);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $status = $request->input('verified', false);
        $user->setVerified($status);

        return response()->json(['message' => 'User accepted and verified'], 200);
    }
    public function getArtistAndPrintingProvider(Request $request)
    {
        // Define the role IDs for "Graphic Designer" and "Printing Provider"
        $roleIds = [3, 4]; // Assuming 3 is Graphic Designer and 4 is Printing Provider

        // Fetch users with the specified roles
        $users = User::whereIn('role_id', $roleIds)
            ->with('personalInformation') // Load personal information directly
            ->get();

        // Define a mapping of role IDs to role names
        $roleNames = [
            3 => 'Graphic Designer',
            4 => 'Printing Provider',
        ];

        // Add the role name to each user based on their role_id
        foreach ($users as $user) {
            $user->role_name = $roleNames[$user->role_id] ?? 'Unknown'; // Set the role name, default to 'Unknown' if not found
        }

        Log::info('Retrieved users for roles:', ['role_ids' => $roleIds, 'users' => $users]);

        return response()->json(['users' => $users], 200);
    }
    public function updateUserBioSkills(Request $request, $id)
    {
        Log::info('Incoming request data for user profile update:', $request->all());

        // Validation
        $validator = Validator::make($request->all(), [
            'bio' => 'nullable|string',           // For AboutMe
            'skills' => 'nullable|array',         // Array of skill IDs
            'printing_skills' => 'nullable|array' // Array of printing skill IDs
        ]);

        if ($validator->fails()) {
            Log::error('Validation errors on profile update:', $validator->errors()->toArray());
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Retrieve user
        $user = $this->userModel->find($id);
        if (!$user) {
            Log::error('User not found with ID:', [$id]);
            return response()->json(['error' => 'User not found'], 404);
        }

        // Step 1: Update AboutMe if bio is provided and has changed
        if ($request->filled('bio') && $user->about_me?->content !== $request->bio) {
            Log::info('Updating AboutMe entry for user ID:', [$id]);
            $user->aboutMe()->updateOrCreate(
                ['user_id' => $id],
                ['content' => $request->bio]
            );
            Log::info('AboutMe entry updated/created successfully for user ID:', [$id]);
        }

        // Step 2: Sync General Skills only if they have changed
        if ($request->filled('skills')) {
            $existingSkillIds = $user->Userskills()->pluck('skill_id')->toArray();
            $newSkillIds = $request->skills;

            if ($existingSkillIds !== $newSkillIds) { // Only update if there's a difference
                Log::info('Updating skills for user ID:', [$id]);
                $user->Userskills()->delete(); // Delete existing skills
                $user->Userskills()->createMany(
                    array_map(fn($skillId) => ['skill_id' => $skillId, 'user_id' => $id], $newSkillIds)
                );
                Log::info('Skills updated successfully for user ID:', [$id]);
            }
        }

        // Step 3: Sync Printing Skills only if they have changed
        if ($request->filled('printing_skills')) {
            $existingPrintingSkillIds = $user->UserPrintingskills()->pluck('printing_skill_id')->toArray();
            $newPrintingSkillIds = $request->printing_skills;

            if ($existingPrintingSkillIds !== $newPrintingSkillIds) { // Only update if there's a difference
                Log::info('Updating printing skills for user ID:', [$id]);
                $user->UserPrintingskills()->delete(); // Delete existing printing skills
                $user->UserPrintingskills()->createMany(
                    array_map(fn($printingSkillId) => ['printing_skill_id' => $printingSkillId, 'user_id' => $id], $newPrintingSkillIds)
                );
                Log::info('Printing skills updated successfully for user ID:', [$id]);
            }
        }

        Log::info('User profile updated successfully for user ID:', [$id]);
        return response()->json(['message' => 'User profile updated successfully'], 200);
    }
}
