// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// declare global {
//   interface Window {
//     Pusher: any;
//   }
// }

// window.Pusher = Pusher;

// // Cambia esto por la IP PÚBLICA de tu VPS
// const WS_SERVER_IP = "205.234.134.34";

// const echo = new Echo({
//   broadcaster: "pusher",
//   key: "byron",
//   cluster: "mt1",
//   wsHost: WS_SERVER_IP, // SOLO IP, JAMÁS 'localhost'
//   wsPort: 6001,
//   forceTLS: false, // SOLO ws://, NUNCA wss:// en dev
//   encrypted: false,
//   wsPath: "app", // SOLO /app, nada más
//   enabledTransports: ["ws"], // SOLO ws
//   disableStats: true,
// });

// export default echo;

import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: any;
  }
}

window.Pusher = Pusher;

const echo = new Echo({
  broadcaster: "pusher",
  key: "byron",
  cluster: "mt1",
  wsHost: "chatingbot.com.mx",
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,         // HTTPS obligatorio en producción
  encrypted: true,
  wsPath: "soketi/app",   // OJO: SIN el slash inicial, para que quede /soketi/app/byron
  enabledTransports: ["ws", "wss"],
  disableStats: true,
});

export default echo;

