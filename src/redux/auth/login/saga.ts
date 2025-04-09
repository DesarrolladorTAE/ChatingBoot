import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import { toast } from "react-toastify";
// Login Redux States
import { AuthLoginActionTypes } from "./types";
import {
  authLoginApiResponseSuccess,
  authLoginApiResponseError,
} from "./actions";

//Include Both Helper File with needed methods
import {
  getFirebaseBackend,
  setLoggeedInUser,
} from "../../../helpers/firebase_helper";
import {
  postFakeLogin,
  postJwtLogin,
  postSocialLogin,
  postFakeLogout,
  postLogout,
} from "../../../api/index";

import { setAuthorization } from "../../../api/apiCore";

const fireBaseBackend = getFirebaseBackend();

// function* loginUser({ payload: { user } }: any) {
//   // console.log("Saga loginUser iniciada con:", user);
//   // console.log("REACT_APP_DEFAULTAUTH:", process.env.REACT_APP_DEFAULTAUTH);
//   try {
//     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//       const response: Promise<any> = yield call(
//         fireBaseBackend.loginUser,
//         user.email,
//         user.password,
//       );
//       // console.log("Respuesta login:", response);
//       // myData
//       yield put(
//         authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response),
//       );
//     } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
//       const response: Promise<any> = yield call(postJwtLogin, {
//         number: user.number,
//         password: user.password,
//       });
//       setLoggeedInUser(response);
//       yield put(
//         authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response),
//       );
//     } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
//       // console.log("Intentando fake login...");
//       const response: Promise<any> = yield call(postFakeLogin, {
//         number: user.number,
//         password: user.password,
//       });
//       // console.log("Respuesta fake login:", response);
//       setLoggeedInUser(response);
//       // console.log("Respuesta login:", response);
//       yield put(
//         authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response),
//       );
//     }
//   } catch (error: any) {
//     // console.error("Error en loginUser saga:", error);
//     yield put(
//       authLoginApiResponseError(AuthLoginActionTypes.LOGIN_USER, error),
//     );
//   }
// }

function* loginUser({ payload: { user } }: any): Generator<any, void, any> {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const response: any = yield call(
        fireBaseBackend.loginUser,
        user.email,
        user.password,
      );

      yield put(
        authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response),
      );
    } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
      const response: any = yield call(postJwtLogin, {
        number: user.number,
        password: user.password,
      });

      // Guardar usuario y token en localStorage
      localStorage.setItem("authUser", JSON.stringify(response));

      // Establecer token como header por defecto
      setAuthorization(response.token);

      yield put(
        authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response),
      );
    } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
      const response: any = yield call(postFakeLogin, {
        number: user.number,
        password: user.password,
      });

      setLoggeedInUser(response);

      yield put(
        authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response),
      );
    }
  } catch (error: any) {
    let message = "Error al iniciar sesión";
  
    if (error.type === "validation") {
      message = error.errors?.number?.[0] || error.message;
    } else if (error.type === "general") {
      message = error.message;
    }
  
    yield put(
      authLoginApiResponseError(AuthLoginActionTypes.LOGIN_USER, message)
    );
  }
  
}

function* socialLogin({ payload: { data, type } }: any) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      let fireBaseBackend = getFirebaseBackend();
      const response: Promise<any> = yield call(
        fireBaseBackend.socialLoginUser,
        data,
        type,
      );
      setLoggeedInUser(response);
      yield put(
        authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response),
      );
    } else {
      const response: Promise<any> = yield call(postSocialLogin, data);
      yield put(
        authLoginApiResponseSuccess(AuthLoginActionTypes.LOGIN_USER, response),
      );
    }
  } catch (error: any) {
    yield put(
      authLoginApiResponseError(AuthLoginActionTypes.LOGIN_USER, error),
    );
  }
}

// function* logoutUser() {
//   try {
//     // Eliminamos el usuario autenticado del localStorage
//     localStorage.removeItem("authUser");

//     if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
//       // Para Firebase se llama al backend que gestiona el logout
//       const response: Promise<any> = yield call(fireBaseBackend.logout);
//       yield put(
//         authLoginApiResponseSuccess(AuthLoginActionTypes.LOGOUT_USER, response)
//       );
//     }  else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
//       // console.log("Intentando fake login...")
//       // Para autenticación fake se simula la acción de logout.
//       const response: Promise<any> = yield call(postFakeLogout);
//       yield put(
//         authLoginApiResponseSuccess(AuthLoginActionTypes.LOGOUT_USER, response)
//       );
//     } else {
//       // En caso de no tener un método específico, se despacha éxito inmediato.
//       yield put(
//         authLoginApiResponseSuccess(AuthLoginActionTypes.LOGOUT_USER, true)
//       );
//     }
//   } catch (error: any) {
//     yield put(
//       authLoginApiResponseError(AuthLoginActionTypes.LOGOUT_USER, error)
//     );
//   }
// }

// function* logoutUser() {
//   try {
//     // Llama a tu backend Laravel para eliminar el token
//     const response: Promise<any> = yield call(postLogout);

//     // Limpia el token guardado localmente
//     localStorage.removeItem("authUser");

//     yield put(
//       authLoginApiResponseSuccess(AuthLoginActionTypes.LOGOUT_USER, response)
//     );
//   } catch (error: any) {
//     yield put(
//       authLoginApiResponseError(AuthLoginActionTypes.LOGOUT_USER, error)
//     );
//   }
// }

function* logoutUser(): Generator<any, void, any> {
  try {
    const storedUser = localStorage.getItem("authUser");
    const token = storedUser ? JSON.parse(storedUser).token : null;

    if (token) {
      setAuthorization(token);
      // Intenta cerrar sesión en el backend
      yield call(postLogout);
    }
  } catch (error: any) {
    console.warn("Error al cerrar sesión (posiblemente token inválido):", error);
    // No se lanza error porque igual limpiamos el frontend
  } finally {
    // ✅ Limpieza obligatoria, sin importar si falló el logout
    localStorage.removeItem("authUser");
    yield put({
      type: AuthLoginActionTypes.LOGOUT_USER,
    });
  }
}

function* loginSaga() {
  yield takeEvery(AuthLoginActionTypes.LOGIN_USER, loginUser);
  yield takeEvery(AuthLoginActionTypes.LOGOUT_USER, logoutUser);
  yield takeLatest(AuthLoginActionTypes.SOCIAL_LOGIN, socialLogin);
}

export default loginSaga;
