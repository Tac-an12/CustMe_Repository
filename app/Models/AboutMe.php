<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AboutMe extends Model
{
    use HasFactory;

    protected $table = 'about_me';
    protected $fillable = ['user_id', 'content'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
