<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $fillable = ['roleid', 'rolename'];

    public function getRoles()
    {
        return $this->where('rolename', '<>', 'Admin')->get();
    }

    public function users()
    {
        return $this->hasMany(User::class, 'role_id', 'roleid');
    }
}
