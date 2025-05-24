// import Echo from 'laravel-echo';
// import Pusher from 'pusher-js';

// declare global {
//   interface Window {
//     Pusher: any;
//   }
// }

// window.Pusher = Pusher;

// const echo = new Echo({
//   broadcaster: 'pusher',
//   key: 'byron',
//   wsHost: 'chatingbot.com.mx',
//   wsPort: 6001,
//   forceTLS: false,
//   encrypted: false,
//   disableStats: true,
//   cluster: '',
//   enabledTransports: ['ws'],
// });

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

(window as any).Pusher = Pusher;

console.log('Pusher Key:', process.env.REACT_APP_PUSHER_APP_KEY); // <-- para debug

const isLocalhost = window.location.hostname === 'localhost';

const echo = new Echo({
  broadcaster: 'pusher',
  key: process.env.REACT_APP_PUSHER_APP_KEY || '',
  cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER || 'mt1',
  wsHost: process.env.REACT_APP_PUSHER_HOST || (isLocalhost ? 'localhost' : 'chatingbot.com.mx'),
  wsPort: Number(process.env.REACT_APP_PUSHER_PORT) || 6001,
  forceTLS: !isLocalhost, // fuerza TLS solo en producción
  encrypted: !isLocalhost,
  disableStats: true,
  enabledTransports: ['ws', 'wss'],
});


export default echo;

