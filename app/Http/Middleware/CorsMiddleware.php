<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CorsMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        if ($request->getMethod() === "OPTIONS") {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        // Define the allowed origins
        $allowedOrigins = ['http://127.0.0.1:8000']; // Add your frontend URL here

        if (in_array($request->headers->get('Origin'), $allowedOrigins)) {
            $response->headers->set('Access-Control-Allow-Origin', $request->headers->get('Origin'));
        }

        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        $response->headers->set('Access-Control-Allow-Credentials', 'true');

        return $response;
    }
}
