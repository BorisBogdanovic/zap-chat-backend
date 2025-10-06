<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class Chat extends Facade
{
    protected static function getFacadeAccessor()
    {
        return 'Chat';
    }
}
