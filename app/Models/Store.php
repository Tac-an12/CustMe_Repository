<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = ['storename', 'description', 'location_id', 'user_id'];

    // Create a new store
    public function createStore(array $storeData)
    {
        // Assuming $storeData includes the location data
        $locationData = $storeData['location'];

        // First, create the location using the Location model
        $location = Location::create($locationData);

        // Then, associate the location with the store
        $storeData['location_id'] = $location->id;

        // Finally, create the store
        return $this->create($storeData);
    }


    // Get all stores, optionally with associated locations
    public function getAllStores(bool $withLocation = true)
    {
        if ($withLocation) {
            return $this->with(['location', 'user.personalInformation:firstname,lastname,user_id'])->get();
        }

        return $this->with('user.personalInformation:firstname,lastname,user_id')->get();
    }


    // Update a store
    public function updateStore(int $id, array $storeData)
    {
        $store = $this->find($id);

        if ($store) {
            // If the location needs to be updated
            if (isset($storeData['location'])) {
                $store->location->update($storeData['location']);
            }

            // Update the store data
            $store->update($storeData);
            return $store;
        }

        return false;
    }


    // Delete a store
    public function deleteStore(int $id)
    {
        $store = $this->find($id);

        if ($store) {
            $store->delete();
            return true;
        }

        return false;
    }


    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
