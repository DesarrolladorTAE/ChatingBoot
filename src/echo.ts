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
  wsHost: "205.234.134.34", // IP pública del VPS
  wsPort: 6001, // Puerto de Soketi expuesto por Docker
  forceTLS: false, // SOLO ws:// en desarrollo
  encrypted: false,
  wsPath: "", // SOLO /soketi (¡sin /app al final!)
  enabledTransports: ["ws"], // SOLO ws
  disableStats: true,
});

export default echo;

// import Echo from "laravel-echo";
// import Pusher from "pusher-js";

// declare global {
//   interface Window {
//     Pusher: any;
//   }
// }

// window.Pusher = Pusher;

// const echo = new Echo({
//   broadcaster: "pusher",
//   key: "byron",
//   cluster: "mt1",
//   wsHost: "chatingbot.com.mx",
//   wsPort: 6001,
//   wssPort: 6001,
//   forceTLS: true,
//   encrypted: true,
//   wsPath: "/soketi",  // <-- AQUÍ
//   enabledTransports: ["ws", "wss"],
//   disableStats: true,
// });

// export default echo;
