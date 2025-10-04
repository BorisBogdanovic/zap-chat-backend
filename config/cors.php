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

    // Dozvoli sve HTTP metode (GET, POST, PUT, DELETE, itd.)
    'allowed_methods' => ['*'],

    // Dozvoli da frontend sa localhost:5173 komunicira sa backendom
    'allowed_origins' => ['http://localhost:5173'],

    // Ostavlja se prazno ako ne koristiš regex obrasce
    'allowed_origins_patterns' => [],

    // Dozvoli sve headere
    'allowed_headers' => ['*'],

    // Nema posebnih headera koji moraju biti izloženi
    'exposed_headers' => [],

    // Vreme trajanja cache-a CORS odgovora (0 = nema cache-a)
    'max_age' => 0,

    // Potrebno ako koristiš autentifikaciju (Sanctum, cookies)
    'supports_credentials' => true,

];
