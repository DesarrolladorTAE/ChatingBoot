import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: any;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: 'pusher',
  key: 'byron',
  wsHost: 'chatingbot.com.mx',
  wsPort: 6001,
  forceTLS: false,
  encrypted: false,
  disableStats: true,
  cluster: '',
  enabledTransports: ['ws'],
});

export default echo;
