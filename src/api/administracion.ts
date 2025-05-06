import { APIClient } from "./apiCore";
import * as url from "./urls";

const api = new APIClient();

// Obtener todas las conexiones
const getConexiones = () => {
  return api.get(url.GET_CONEXIONES);
};

// Eliminar una conexión por ID
const deleteConexion = (id: number) => {
  return api.delete(url.DELETE_CONEXION(id));
};

// Desconectar sesión por connection_id
const disconnectConexion = (connectionId: string) => {
  return api.create(url.DISCONNECT_SESSION(connectionId));
};

// Cerrar sesión (logout) y reiniciar con nuevo QR
const logoutConexion = (connectionId: string) => {
  return api.create(url.LOGOUT_SESSION(connectionId));
};

// (Opcional) Editar conexión
const updateConexion = (id: number, data: object) => {
  return api.update(url.UPDATE_CONEXION(id), data);
};

// (Opcional) Marcar como predeterminada
const setAsDefault = (id: number) => {
  return api.create(url.SET_CONEXION_DEFAULT(id));
};
// (Opcional) Crear una nueva conexión
const createConexion = (data: object) => {
  return api.create(url.CREATE_CONEXION, data);
};

// ✅ Iniciar sesión manualmente
const startSesion = (connectionId: string) => {
  return api.create(url.START_SESSION, { connectionId });
};

// ✅ Obtener QR de una sesión
const getQrCode = (connectionId: string) => {
  return api.get(url.GET_QR_CODE(connectionId));
};

export {
  getConexiones,
  deleteConexion,
  disconnectConexion,
  logoutConexion,
  createConexion,
  updateConexion,
  setAsDefault,
  startSesion,
  getQrCode,
};
