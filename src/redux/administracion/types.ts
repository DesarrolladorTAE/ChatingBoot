// redux/administracion/types.ts
export enum AdministracionActionTypes {
  // 📡 API responses
  FETCH_CONEXIONES_REQUEST = "@@administracion/FETCH_CONEXIONES_REQUEST",
  FETCH_CONEXIONES_SUCCESS = "@@administracion/FETCH_CONEXIONES_SUCCESS",
  FETCH_CONEXIONES_FAILURE = "@@administracion/FETCH_CONEXIONES_FAILURE",

  // 🔌 Conexiones
  DISCONNECT_CONEXION_REQUEST = "@@administracion/DISCONNECT_CONEXION_REQUEST",
  DISCONNECT_CONEXION_SUCCESS = "@@administracion/DISCONNECT_CONEXION_SUCCESS",

  LOGOUT_CONEXION_REQUEST = "@@administracion/LOGOUT_CONEXION_REQUEST",

  DELETE_CONEXION_REQUEST = "@@administracion/DELETE_CONEXION_REQUEST",
  DELETE_CONEXION_SUCCESS = "@@administracion/DELETE_CONEXION_SUCCESS",

  CREATE_CONEXION_REQUEST = "@@administracion/CREATE_CONEXION_REQUEST",
  CREATE_CONEXION_SUCCESS = "@@administracion/CREATE_CONEXION_SUCCESS",
  CREATE_CONEXION_FAILURE = "@@administracion/CREATE_CONEXION_FAILURE",

  UPDATE_CONEXION_REQUEST = "@@administracion/UPDATE_CONEXION_REQUEST",
  UPDATE_CONEXION_SUCCESS = "@@administracion/UPDATE_CONEXION_SUCCESS",
  UPDATE_CONEXION_FAILURE = "@@administracion/UPDATE_CONEXION_FAILURE",

  START_SESSION_REQUEST = "@@administracion/START_SESSION_REQUEST",
  START_SESSION_SUCCESS = "@@administracion/START_SESSION_SUCCESS",
  START_SESSION_FAILURE = "@@administracion/START_SESSION_FAILURE",

  FETCH_QR_REQUEST = "@@administracion/FETCH_QR_REQUEST",
  FETCH_QR_SUCCESS = "@@administracion/FETCH_QR_SUCCESS",
  FETCH_QR_FAILURE = "@@administracion/FETCH_QR_FAILURE",
  CLEAR_QR_CODE = "@@administracion/CLEAR_QR_CODE",

  SET_AS_DEFAULT_REQUEST = "@@administracion/SET_AS_DEFAULT_REQUEST",
  SET_AS_DEFAULT_SUCCESS = "@@administracion/SET_AS_DEFAULT_SUCCESS",
  SET_AS_DEFAULT_FAILURE = "@@administracion/SET_AS_DEFAULT_FAILURE",
}

// 🧩 Conexión individual
export interface Connection {
  id: number;
  name: string;
  connection_id: string;
  session_status: string;
  updated_at: string;
  is_team_default: boolean;
  greeting_message?: string;
  farewell_message?: string;
  off_hours_message?: string;
  qr_code?: string;
}

export interface AdministracionState {
  conexiones: {
    list: Connection[];
    loading: boolean;
    error: string | null;
  };
  qrCode: {
    qr: string | null;
    status: string | null;
    connection_id: string | null;
    loading: boolean;
    error: string | null;
  };
}
