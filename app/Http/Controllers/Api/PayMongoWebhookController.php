<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Exception;
use App\Models\InitialPayment;
use App\Models\Request as RequestModel;

class PayMongoWebhookController extends Controller
{
    public function handleWebhook(Request $request)
    {
        // Retrieve the PayMongo webhook secret key from the environment configuration
        $payMongoSecretKey = config('services.paymongo.secret_key');

        // Verify that the request comes from PayMongo (Security check)
        $receivedSignature = $request->header('Paymongo-Signature');
        $expectedSignature = hash_hmac('sha256', json_encode($request->all()), $payMongoSecretKey);

        // If signature mismatch, log the error but return 200 status code to avoid disabling webhook
        if ($receivedSignature !== $expectedSignature) {
            Log::error('Webhook signature mismatch');
            // Instead of returning a 400, we log the error and return a 200 to indicate we received the request
            return response()->json(['error' => 'Invalid signature'], 200); // Return 200 even on error
        }

        // Process the webhook data
        $webhookData = $request->all();
        Log::info('Received PayMongo Webhook:', $webhookData);

        try {
            // Check if the payment was successful
            if (isset($webhookData['data']['attributes']['status']) && $webhookData['data']['attributes']['status'] == 'paid') {
                // Extract the transaction ID and other necessary details
                $transactionId = $webhookData['data']['attributes']['transaction_id'];
                $postId = $webhookData['data']['attributes']['line_items'][0]['name']; // Or use another identifier

                // Find the related InitialPayment record
                $initialPayment = InitialPayment::where('transaction_id', $transactionId)->first();

                if ($initialPayment) {
                    // Update the payment status in the database
                    $initialPayment->update([
                        'status' => 'completed',
                        'transaction_id' => $transactionId,
                    ]);

                    // You might want to update the request status as well
                    $requestModel = RequestModel::where('post_id', $postId)->first();
                    if ($requestModel) {
                        $requestModel->update([
                            'status' => 'payment_received',
                        ]);
                    }

                    Log::info('Payment successfully processed for transaction: ' . $transactionId);
                }
            }

            // Return success response to PayMongo (Always return 200 for successful webhook processing)
            return response()->json(['status' => 'success'], 200); // Return 200 even if the logic was executed

        } catch (Exception $e) {
            // Log the exception error
            Log::error('Error processing PayMongo webhook: ' . $e->getMessage());

            // Return success response, because PayMongo expects 200 status code, even on error
            return response()->json(['error' => 'Webhook processing failed'], 200); // Return 200 even on exception
        }
    }
}

    // public function webhook(Request $request){
    //     $payMongoSecretKey = config('services.paymongo.secret_key');
    //     $webhook_signature = $request->header('Paymongo_Signature');
    //     $event_datas = $request->getContent();
    //     $event_filter =json_decode($event_datas,true);



    //     $webhook_signature_raw = preg_split("/,/",$webhook_signature);
    //     $webhook_signature_raw_time = preg_split("/=/",$webhook_signature_raw[0]);
    //     $webhook_signature_raw_data = preg_split("/=/",$webhook_signature_raw[1]);

    //     $webhook_signature_time = $webhook_signature_raw_time[1];
    //     $webhook_signature_data = $webhook_signature_raw_data[1];

    //     $webhook_time_with_json_data = $webhook_signature_time.'.'.$event_datas;

    //     $computedSignature =hash_hmac('sha256', $webhook_time_with_json_data,$payMongoSecretKey);

    //     $mySignature = hash_equals($computedSignature,$webhook_signature_data);

    //     if($mySignature == 1 || $mySignature == true){
    //         foreach($event_filter as $datas){
    //             webhookModel::insert([
    //                 'payload' =>$datas['attributes']['type'],
    //             ]);

    //         }
    //     } 
    // }
