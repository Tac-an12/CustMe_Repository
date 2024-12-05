import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: '087ae63043c8feb92728', 
    cluster: 'ap1',  
    forceTLS: true
});

export default echo;
