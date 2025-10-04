<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Ovde se podešava komunikacija između tvog frontenda (React/Vite)
    | i Laravel backenda (API i broadcasting kanali).
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'broadcasting/auth'],

    
    'allowed_methods' => ['*'],

   
    'allowed_origins' => ['http://localhost:5173'],

   
    'allowed_origins_patterns' => [],

    
    'allowed_headers' => ['*'],

    
    'exposed_headers' => [],

    
    'max_age' => 0,

    
    'supports_credentials' => true,

];
