import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Add Pusher to the global window object
window.Pusher = Pusher;

// Retrieve the auth token from localStorage
const authToken = localStorage.getItem('authToken');
// Retrieve the CSRF token from the meta tag
const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

if (authToken) {
    // Initialize Laravel Echo with Pusher
    window.Echo = new Echo({
        broadcaster: 'pusher',
        key: '087ae63043c8feb92728', // Your Pusher app key
        cluster: 'ap1', // Your Pusher app cluster
        forceTLS: true, // Use TLS
        authEndpoint: '/broadcasting/auth', // Laravel auth endpoint
        auth: {
            headers: {
                Authorization: `Bearer ${authToken}`, // Pass Bearer token from localStorage
                'X-CSRF-TOKEN': csrfToken, // Pass CSRF token here
            },
        },
    });

    console.log('Echo initialized successfully');
} else {
    console.error('No auth token found in localStorage');
}
