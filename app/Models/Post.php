<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasFactory;

    protected $primaryKey = 'post_id';
    protected $fillable = ['title', 'content', 'price', 'quantity', 'user_id'];

    public function createPost(array $task)
    {
        return $this->create($task);
    }

    public function images()
    {
        return $this->hasMany(Image::class, 'post_id', 'post_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
    public function requests()
    {
        return $this->hasMany(Request::class, 'post_id', 'post_id');
    }
    public function tags()
    {
        return $this->belongsToMany(Tags::class, 'post_tag', 'post_id', 'tag_id');
    }
}
