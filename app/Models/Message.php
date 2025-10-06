<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
   protected $fillable = [
        'from_id',
        'to_id',
        'message',
        'read_at',
    ];

    public function from()
    {
        return $this->belongsTo(User::class, 'from_id');
    }

    public function to()
    {
        return $this->belongsTo(User::class, 'to_id');
    }


    public function scopeBetweenUsers($query, int $userId, int $contactId)
{
    return $query->where(function ($q) use ($userId, $contactId) {
                $q->where('from_id', $userId)->where('to_id', $contactId);
            })
            ->orWhere(function ($q) use ($userId, $contactId) {
                $q->where('from_id', $contactId)->where('to_id', $userId);
            });
}


    protected $with = ['from', 'to'];
}
