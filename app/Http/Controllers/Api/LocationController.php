<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Location;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    protected $locationModel;

    public function __construct()
    {
        $this->locationModel = new Location();  // Initialize the Location model in the constructor
    }

    public function saveLocation(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'longitude' => 'required|numeric',
            'latitude' => 'required|numeric',
            'address' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $this->locationModel->createLocation($request->all());

        return response()->json(['message' => 'Location Added'], 200);
    }

    public function getAllLocations()
    {
        return response()->json(['data' => $this->locationModel->getAllLocations()], 200);
    }

    public function updateLocation(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'longitude' => 'required|numeric',
            'latitude' => 'required|numeric',
            'address' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $updatedLocation = $this->locationModel->updateLocation($id, $request->all());

        if ($updatedLocation) {
            return response()->json(['message' => 'Location Updated'], 200);
        }

        return response()->json(['error' => 'Location Not Found'], 404);
    }

    public function deleteLocation($id)
    {
        $isDeleted = $this->locationModel->deleteLocation($id);

        if ($isDeleted) {
            return response()->json(['message' => 'Location Deleted'], 200);
        }

        return response()->json(['error' => 'Location Not Found'], 404);
    }
}
