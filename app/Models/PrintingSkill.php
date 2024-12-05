<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class PrintingSkill extends Model
{
    use HasFactory;
    protected $primaryKey = 'printing_skill_id';


    protected $fillable = ['printing_skill_name'];

    public function getAllPrintingSkills()
    {
        return $this->all();
    }
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_printing_skills', 'printing_skill_id', 'user_id');
    }
}
