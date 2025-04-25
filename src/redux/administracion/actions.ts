// redux/administracion/actions.ts
import {
  Connection,
  AdministracionActionTypes,
} from './types';

// 📡 Obtener conexiones
export const fetchConexionesRequest = () => ({
  type: AdministracionActionTypes.FETCH_CONEXIONES_REQUEST,
});

export const fetchConexionesSuccess = (conexiones: Connection[]) => ({
  type: AdministracionActionTypes.FETCH_CONEXIONES_SUCCESS,
  payload: conexiones,
});

export const fetchConexionesFailure = (error: string) => ({
  type: AdministracionActionTypes.FETCH_CONEXIONES_FAILURE,
  payload: error,
});

// 🔌 Desconectar conexión
export const disconnectConexionRequest = (connectionId: string) => ({
  type: AdministracionActionTypes.DISCONNECT_CONEXION_REQUEST,
  payload: connectionId,
});

// 🗑️ Eliminar conexión
export const deleteConexionRequest = (id: number) => ({
  type: AdministracionActionTypes.DELETE_CONEXION_REQUEST,
  payload: id,
});

// ✅ Acción después de desconexión exitosa
export const disconnectConexionSuccess = () => ({
  type: AdministracionActionTypes.DISCONNECT_CONEXION_SUCCESS,
});

// ✅ Acción después de eliminación exitosa
export const deleteConexionSuccess = () => ({
  type: AdministracionActionTypes.DELETE_CONEXION_SUCCESS,
});

export const createConexionRequest = (data: object) => ({
  type: AdministracionActionTypes.CREATE_CONEXION_REQUEST,
  payload: data,
});

export const createConexionSuccess = () => ({
  type: AdministracionActionTypes.CREATE_CONEXION_SUCCESS,
});

export const createConexionFailure = (error: string) => ({
  type: AdministracionActionTypes.CREATE_CONEXION_FAILURE,
  payload: error,
});

export const startSessionRequest = (connectionId: string) => ({
  type: AdministracionActionTypes.START_SESSION_REQUEST,
  payload: connectionId,
});

export const fetchQrRequest = (connectionId: string) => ({
  type: AdministracionActionTypes.FETCH_QR_REQUEST,
  payload: connectionId,
});

export const clearQrCode = () => ({
  type: AdministracionActionTypes.CLEAR_QR_CODE,
});

export const updateConexionRequest = (id: number, data: Partial<Connection>) => ({
  type: AdministracionActionTypes.UPDATE_CONEXION_REQUEST,
  payload: { id, data },
});

export const updateConexionSuccess = () => ({
  type: AdministracionActionTypes.UPDATE_CONEXION_SUCCESS,
});

export const updateConexionFailure = (error: string) => ({
  type: AdministracionActionTypes.UPDATE_CONEXION_FAILURE,
  payload: error,
});

// ⭐ Marcar una conexión como predeterminada
export const setAsDefaultRequest = (id: number) => ({
  type: AdministracionActionTypes.SET_AS_DEFAULT_REQUEST,
  payload: id,
});

export const setAsDefaultSuccess = () => ({
  type: AdministracionActionTypes.SET_AS_DEFAULT_SUCCESS,
});

export const setAsDefaultFailure = (error: string) => ({
  type: AdministracionActionTypes.SET_AS_DEFAULT_FAILURE,
  payload: error,
});
