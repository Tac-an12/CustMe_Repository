<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Request extends Model
{
    use HasFactory;

    protected $table = 'requests';

    protected $primaryKey = 'request_id';

    protected $fillable = [
        'request_type',
        'status',
        'timestamp',
        'user_id',
        'target_user_id',
        'request_content',
        'post_id'

    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function targetUser()
    {
        return $this->belongsTo(User::class, 'target_user_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'request_id', 'request_id'); // 'request_id' as foreign key and primary key
    }

    public function post()
    {
        return $this->belongsTo(Post::class, 'post_id', 'post_id');
    }
    public function initialPayments()
    {
        return $this->hasMany(InitialPayment::class, 'request_id', 'request_id');
    }
    public function targetUserPayments()
    {
        return $this->hasMany(InitialPayment::class, 'request_id')->where('user_id', $this->target_user_id);
    }
}
