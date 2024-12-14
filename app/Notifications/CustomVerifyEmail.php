<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Carbon;

class CustomVerifyEmail extends Notification
{
    use Queueable;

    protected $verificationCode;

    /**
     * Create a new notification instance.
     *
     * @param string $verificationCode
     */
    public function __construct($verificationCode)
    {
        $this->verificationCode = $verificationCode;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        if (!$notifiable instanceof MustVerifyEmail) {
            return null;
        }

        // Generate the URL for email verification
        $verificationUrl = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verify Your Email Address')
            ->line('Thanks for signing up! Please verify your email address by entering the code below.')
            ->line("Your verification code is: {$this->verificationCode}") // Send the verification code in the email
            ->line('If you did not create an account, no further action is required.')
            ->action('Verify Email Address', $verificationUrl); // This will be the link the user clicks on
    }

    /**
     * Generate the verification URL without expiration.
     */
    protected function verificationUrl($notifiable)
    {
        // Generate the signed URL for verification (this will have the /api prefix)
        $url = URL::signedRoute(
            'verification.verify', // This is the route for email verification
            [
                'id' => $notifiable->getKey(),
                'hash' => sha1($notifiable->getEmailForVerification()),
            ]
        );
    
        // Remove /api from the URL to match the frontend URL structure
        $urlWithoutApi = str_replace('/api', '', $url);
    
        return $urlWithoutApi;
    }
    
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            //
        ];
    }
}
