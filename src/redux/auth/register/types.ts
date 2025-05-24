export enum AuthRegisterActionTypes {
  API_RESPONSE_SUCCESS = "@@auth/register/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@auth/register/API_RESPONSE_ERROR",
  VERIFY_CODE = "@@auth/register/VERIFY_CODE",  // Nueva acción para la verificación del código
  REGISTER_USER = "@@auth/register/REGISTER_USER",
}

export interface AuthRegisterState {
  registrationError: any;
  verificationError: any; // Error de verificación
  message: string;
  loading: boolean;
  user: object | null;
  token: string | null;  // Agregar token
  isUserRegistered: boolean; // Indica si el usuario ha sido registrado
  codeVerified: boolean;     // Indica si el código de verificación fue confirmado
}

