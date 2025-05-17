import React from "react";
import { getLoggedinUser, setAuthorization} from "./api/apiCore";

// scss
import "./assets/scss/theme.scss";

//Route
import Routes from "./routes";

// Import Firebase Configuration file
// import { initFirebaseBackend } from "./helpers/firebase_helper";

// api config
// import config from "./config";
// import fakeBackend from "./helpers/fakeBackend";

// TODO
// fakeBackend();

// const firebaseConfig = {
//   apiKey: config.FIRE_BASE.API_KEY,
//   authDomain: config.FIRE_BASE.AUTH_DOMAIN,
//   databaseURL: config.FIRE_BASE.DATABASEURL,
//   projectId: config.FIRE_BASE.PROJECTID,
//   storageBucket: config.FIRE_BASE.STORAGEBUCKET,
//   messagingSenderId: config.FIRE_BASE.MESSAGINGSENDERID,
//   appId: config.FIRE_BASE.APPID,
//   measurementId: config.FIRE_BASE.MEASUREMENTID,
// };

// // init firebase backend
// initFirebaseBackend(firebaseConfig);

// ✅ Asegura que el token se configure antes de hacer peticiones protegidas
const user = getLoggedinUser();
if (user && user.token) {
  setAuthorization(user.token);
}

const App = () => {
  document.title = "ChattingBot"

  return <Routes />;
};

export default App;
