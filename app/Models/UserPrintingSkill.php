<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserPrintingSkill extends Model
{
    use HasFactory;

    protected $table = 'user_printing_skills'; // Explicitly define the table name

    protected $fillable = ['user_id', 'printing_skill_id'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function printingSkill()
    {
        return $this->belongsTo(PrintingSkill::class, 'printing_skill_id', 'printing_skill_id'); // Assuming `printing_skill_id` is primary in printing_skills
    }
}
