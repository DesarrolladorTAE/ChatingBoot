import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import { setAuthorization } from "../../../api/apiCore";
import { AuthRegisterActionTypes } from "./types";
import {
  authRegisterApiResponseSuccess,
  authRegisterApiResponseError,
} from "./actions";
import { postJwtRegister, postVerifyCode } from "../../../api/index";

// Saga para manejar el registro de usuario
// function* registerUser({ payload: { user } }: any): Generator<any, void, any> {
//   try {
//     console.log("Iniciando registro con los datos del usuario:", user);
//     const response = yield call(postJwtRegister, user);

//     console.log("Respuesta del registro:", response);

//     // Guardamos el token y usuario en localStorage
//     localStorage.setItem(
//       "authUser",
//       JSON.stringify({ ...response.user, token: response.token }),
//     );

//     // Establecer el token de autorización
//     setAuthorization(response.token);

//     // Despachamos la respuesta exitosa al store
//     yield put(
//       authRegisterApiResponseSuccess(
//         AuthRegisterActionTypes.REGISTER_USER,
//         response,
//       ),
//     );
//   } catch (error: any) {
//     console.error("Error al registrar el usuario:", error);
//     yield put(
//       authRegisterApiResponseError(
//         AuthRegisterActionTypes.REGISTER_USER,
//         error,
//       ),
//     );
//   }
// }

function* registerUser({ payload: { user } }: any): Generator<any, void, any> {
  try {
    const response = yield call(postJwtRegister, user);

    // Solo guardamos usuario, no token
    localStorage.setItem("authUser", JSON.stringify(response.user));

    yield put(
      authRegisterApiResponseSuccess(
        AuthRegisterActionTypes.REGISTER_USER,
        response,
      ),
    );
  } catch (error: any) {
    yield put(
      authRegisterApiResponseError(
        AuthRegisterActionTypes.REGISTER_USER,
        error,
      ),
    );
    console.error("Error al registrar el usuario:", error);
  }
}

// Saga para manejar la verificación del código
function* verifyCode({ payload: { code } }: any): Generator<any, void, any> {
  try {
    console.log("Verificando el código:", code);
    const response: any = yield call(postVerifyCode, code);

    console.log("Respuesta de verificación:", response);

    // Aquí validamos que venga token y user directamente en response
    if (response.token && response.user) {
      const { token, user } = response;

      // Guardar usuario y token en localStorage
      localStorage.setItem(
        "authUser",
        JSON.stringify({
          ...user,
          token,
        }),
      );

      // Establecer token como header por defecto
      setAuthorization(token);

      // Dispatch de éxito con la data completa
      yield put(
        authRegisterApiResponseSuccess(
          AuthRegisterActionTypes.VERIFY_CODE,
          response,
        ),
      );
    } else {
      console.error("Error en la verificación del código:", response);
      yield put(
        authRegisterApiResponseError(
          AuthRegisterActionTypes.VERIFY_CODE,
          "Código incorrecto o expirado",
        ),
      );
    }
  } catch (error: any) {
    console.error("Error al verificar el código:", error);

    let message = "Error al verificar el código";

    if (error.type === "validation") {
      message = error.errors?.code?.[0] || error.message;
    } else if (error.type === "general") {
      message = error.message;
    }

    yield put(
      authRegisterApiResponseError(
        AuthRegisterActionTypes.VERIFY_CODE,
        message,
      ),
    );
  }
}

// Observadores para las acciones de registro y verificación del código
export function* watchUserRegister() {
  yield takeEvery(AuthRegisterActionTypes.REGISTER_USER, registerUser);
}

export function* watchVerifyCode() {
  yield takeEvery(AuthRegisterActionTypes.VERIFY_CODE, verifyCode);
}

// Función principal de la saga para registrar y verificar
function* registerSaga() {
  yield all([fork(watchUserRegister), fork(watchVerifyCode)]);
}

export default registerSaga;
