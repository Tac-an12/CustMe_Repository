<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $guarded = ['id'];
    protected $fillable = ['username', 'email', 'password', 'role_id', 'verified'];

    public function createRegister(array $task)
    {
        return $this->create($task);
    }

    public function setVerified(bool $status)
    {
        $this->verified = $status;
        return $this->save();
    }

    public function role()
    {
        return $this->belongsTo(Role::class, 'role_id', 'roleid');
    }

    public function requests()
    {
        return $this->hasMany(Request::class);
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }
    public function personalInformation()
    {
        return $this->hasOne(PersonalInformation::class, 'user_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'user_id');
    }

    public function stores()
    {
        return $this->hasMany(Store::class);
    }

    public function sentChats()
    {
        return $this->hasMany(Chat::class, 'sender_id');
    }

    public function receivedChats()
    {
        return $this->hasMany(Chat::class, 'receiver_id');
    }
    public function aboutMe()
    {
        return $this->hasOne(AboutMe::class, 'user_id');
    }

    public function certificates()
    {
        return $this->hasMany(UserCertificate::class, 'user_id');
    }
    public function skills(): BelongsToMany
    {
        return $this->belongsToMany(Skill::class, 'user_skills', 'user_id', 'skill_id');
    }
    public function Userskills()
    {
        return $this->hasMany(UserSkill::class, 'user_id');
    }
    public function UserPrintingskills()
    {
        return $this->hasMany(UserPrintingSkill::class, 'user_id');
    }
    public function printingSkills(): BelongsToMany
    {
        return $this->belongsToMany(PrintingSkill::class, 'user_printing_skills', 'user_id', 'printing_skill_id');
    }

    public function portfolios()
    {
        return $this->hasMany(Portfolio::class, 'user_id');
    }

    public function initialPayments()
    {
        return $this->hasMany(InitialPayment::class, 'user_id');
    }

    public function payments()
    {
        return $this->hasMany(Payment::class, 'user_id');
    }

    public function balance()
    {
        return $this->hasOne(UserBalance::class, 'user_id');
    }
    public function balanceRequests()
    {
        return $this->hasMany(BalanceRequest::class);
    }
}
