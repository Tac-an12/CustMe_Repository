<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = ['skill_name'];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_skills', 'skill_id', 'user_id');
    }

    public function getAllUserSkills()
    {
        return $this->all();
    }
}
