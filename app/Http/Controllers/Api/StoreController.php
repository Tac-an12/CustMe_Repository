<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Store;
use App\Models\Location;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

class StoreController extends Controller
{
    protected $storeModel;
    protected $locationModel;

    public function __construct()
    {
        $this->storeModel = new Store();  // Initialize the Store model in the constructor
        $this->locationModel = new Location();  // Initialize the Location model in the constructor
    }

    public function saveStore(Request $request)
    {
        // Log the incoming request data
        Log::info('Incoming store creation request:', $request->all());

        // Validate the store data along with location details
        $validator = Validator::make($request->all(), [
            'storename' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location.longitude' => 'required|numeric',
            'location.latitude' => 'required|numeric',
            'location.address' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            Log::warning('Store creation failed due to validation errors:', $validator->errors()->toArray());
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Call the createStore method on an instance of the Store model
        $store = $this->storeModel->createStore($request->all());

        // Log the successful store creation with the store ID
        Log::info('Store created successfully with ID:', ['store_id' => $store->id]);

        return response()->json(['message' => 'Store Added', 'store' => $store], 200);
    }


    public function getAllStores()
    {
        return response()->json(['data' => $this->storeModel->getAllStores()], 200);
    }

    public function updateStore(Request $request, $id)
    {
        // Validate the store data along with location details
        $validator = Validator::make($request->all(), [
            'storename' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location.longitude' => 'required|numeric',
            'location.latitude' => 'required|numeric',
            'location.address' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        // Handle location update or retrieval
        $location = $this->locationModel->where('longitude', $request->input('location.longitude'))
            ->where('latitude', $request->input('location.latitude'))
            ->first();

        if (!$location) {
            $location = $this->locationModel->create([
                'longitude' => $request->input('location.longitude'),
                'latitude' => $request->input('location.latitude'),
                'address' => $request->input('location.address'),
            ]);
        }

        // Update the store with the new location_id
        $storeData = $request->all();
        $storeData['location_id'] = $location->id;
        $updatedStore = $this->storeModel->updateStore($id, $storeData);

        if ($updatedStore) {
            return response()->json(['message' => 'Store Updated'], 200);
        }

        return response()->json(['error' => 'Store Not Found'], 404);
    }

    public function deleteStore($id)
    {
        $isDeleted = $this->storeModel->deleteStore($id);

        if ($isDeleted) {
            return response()->json(['message' => 'Store Deleted'], 200);
        }

        return response()->json(['error' => 'Store Not Found'], 404);
    }
    public function searchStores(Request $request)
    {
        $query = $request->input('query');
        $stores = Store::with('location')
            ->where('storename', 'LIKE', "%{$query}%")
            ->orWhereHas('location', function ($q) use ($query) {
                $q->where('address', 'LIKE', "%{$query}%");
            })
            ->get();

        return response()->json($stores);
    }
}
