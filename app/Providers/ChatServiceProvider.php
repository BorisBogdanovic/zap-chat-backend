<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\ChatService; 

class ChatServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton("Chat",function($app){
            return new ChatService();
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        
    }
}
