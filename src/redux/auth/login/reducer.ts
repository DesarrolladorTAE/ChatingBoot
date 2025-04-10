import { AuthLoginActionTypes, AuthLoginState } from "./types";

export const INIT_STATE: AuthLoginState = {
  error: "",
  loading: false,
  isUserLogin: false,
  isUserLogout: false,
  user: null,
};

const Login = (state: AuthLoginState = INIT_STATE, action: any): AuthLoginState => {
  switch (action.type) {
    case AuthLoginActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case AuthLoginActionTypes.LOGIN_USER:
          return {
            ...state,
            user: action.payload.data,
            loading: false,
            isUserLogin: true,
            isUserLogout: false,
          };
        case AuthLoginActionTypes.LOGOUT_USER:
          return {
            ...state,
            loading: false,
            isUserLogout: true,
            isUserLogin: false,
            user: null,
            error: "",
          };
        default:
          return state;
      }

    case AuthLoginActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case AuthLoginActionTypes.LOGIN_USER:
          return {
            ...state,
            error: action.payload.error,
            isUserLogin: false,
            loading: false,
          };
        case AuthLoginActionTypes.LOGOUT_USER:
          return {
            ...state,
            loading: false,
            isUserLogin: false,
            isUserLogout: false,
            error: "",
          };
        default:
          return state;
      }

    case AuthLoginActionTypes.LOGIN_USER:
      return {
        ...state,
        loading: true,
        isUserLogin: false,
        isUserLogout: false, // 🧼 limpiamos para evitar loops o errores
      };

    case AuthLoginActionTypes.LOGOUT_USER:
      return {
        ...state,
        loading: false,
        isUserLogout: false,
        isUserLogin: false,
        user: null,
      };

    default:
      return state;
  }
};

export default Login;
