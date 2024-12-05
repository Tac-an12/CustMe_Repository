<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'roles' => \App\Http\Middleware\RoleMiddleware::class,
            'cors' => \App\Http\Middleware\CorsMiddleware::class,  // Add your CORS middleware here
            'sanctum' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);
        
        // If you need the middleware to be global
        // $middleware->global([
        //     \App\Http\Middleware\CorsMiddleware::class,
        // ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
