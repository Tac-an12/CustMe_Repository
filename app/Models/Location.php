<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = ['longitude', 'latitude', 'address'];



    // Get all locations
    public function getAllLocations()
    {
        return $this->all();
    }

    // Update a location
    public function updateLocation(int $id, array $locationData)
    {
        $location = $this->find($id);

        if ($location) {
            $location->update($locationData);
            return $location;
        }

        return false;
    }

    // Delete a location
    public function deleteLocation(int $id)
    {
        $location = $this->find($id);

        if ($location) {
            $location->delete();
            return true;
        }

        return false;
    }

    public function store()
    {
        return $this->hasOne(Store::class);
    }
}
