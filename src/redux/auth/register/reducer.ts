import { AuthRegisterActionTypes, AuthRegisterState } from "./types";

export const INIT_STATE: AuthRegisterState = {
  registrationError: null, // Error relacionado con el registro
  verificationError: null, // Error de verificación del código
  message: "", // Mensajes generales de estado

  loading: false, // Estado de carga
  user: null, // Información del usuario
  token: null, // Inicializa el token como null
  isUserRegistered: false, // Si el usuario ha sido registrado
  codeVerified: false, // Si el código de verificación ha sido ingresado correctamente
};

const Register = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case AuthRegisterActionTypes.API_RESPONSE_SUCCESS:
      switch (action.payload.actionType) {
        case AuthRegisterActionTypes.REGISTER_USER:
          return {
            ...state,
            loading: false,
            user: action.payload.data.user,
            // token: action.payload.data.token,
            registrationError: null,
            isUserRegistered: true, // El registro fue exitoso
          };

        case AuthRegisterActionTypes.VERIFY_CODE:
          return {
            ...state,
            loading: false,
            codeVerified: true, // El código fue verificado correctamente
            verificationError: null, // Sin error en la verificación
            token: action.payload.data.token, // token recibido
            user: action.payload.data.user, // user recibido (según respuesta)
          };

        default:
          return state;
      }

    case AuthRegisterActionTypes.API_RESPONSE_ERROR:
      switch (action.payload.actionType) {
        case AuthRegisterActionTypes.REGISTER_USER:
          return {
            ...state,
            loading: false,
            registrationError: action.payload.error, // Error de registro
            isUserRegistered: false, // Fallo en el registro
          };

        case AuthRegisterActionTypes.VERIFY_CODE:
          return {
            ...state,
            loading: false,
            verificationError: action.payload.error, // Guardamos el error de verificación
            codeVerified: false, // Si hubo error, no se verifica el código
          };

        default:
          return state;
      }

    case AuthRegisterActionTypes.REGISTER_USER: {
      return {
        ...state,
        loading: true,
        isUserRegistered: false, // Mientras se registra, el usuario no está registrado
      };
    }

    default:
      return state;
  }
};

export default Register;
