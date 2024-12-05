<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tags extends Model
{
    use HasFactory;

    // Specify the fillable fields if necessary
    protected $fillable = ['name'];

    // Define the relationship with the PostTags model (inverse of the relationship)
    public function postTags()
    {
        return $this->hasMany(PostTag::class, 'tag_id');  // Corrected the model name to PostTag
    }
}
