<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class UserSkill extends Model
{
    use HasFactory;

    protected $table = 'user_skills';
    protected $primaryKey = 'id';

    protected $fillable = ['user_id', 'skill_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    // Define relationship to Skill
    public function skill()
    {
        return $this->belongsTo(Skill::class, 'skill_id', 'skill_id');
    }
}
