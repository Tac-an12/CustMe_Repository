<?php

use App\Http\Controllers\Api\TaskApiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PaymentController;

Route::get('/{path?}', function () {
    return view('app'); // Adjust this to the correct view file
})->where('path', '.*');

// api/
// Route::group(['prefix' => 'api'], function() {
//     Route::post('/task', [TaskApiController::class, 'saveTask']);
// });

Route::get('/payment-success', [PaymentController::class, 'paymentSuccess'])->name('payment.success');
Route::get('/payment-failed', [PaymentController::class, 'paymentFailed'])->name('payment.failed');
