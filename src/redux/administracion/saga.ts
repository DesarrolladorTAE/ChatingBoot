// redux/administracion/saga.ts
import { call, put, takeLatest, all } from 'redux-saga/effects';
import {
  AdministracionActionTypes,
  Connection,
} from './types';

import {
  fetchConexionesSuccess,
  fetchConexionesFailure,
  fetchConexionesRequest,
  startSessionRequest,
} from './actions';

import {
  getConexiones,
  disconnectConexion,
  deleteConexion,
  logoutConexion,
  createConexion,
  startSesion,
  getQrCode,
  updateConexion,
  setAsDefault,
} from '../../api/index';

// 🔁 Obtener conexiones
function* fetchConexionesSaga(): Generator<any, void, any> {
  try {
    const response: Connection[] = yield call(getConexiones);
    yield put(fetchConexionesSuccess(response));
  } catch (error: any) {
    yield put(fetchConexionesFailure(error.message));
  }
}

// 🔌 Desconectar una conexión
function* disconnectConexionSaga(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield call(disconnectConexion, action.payload);
    yield put(fetchConexionesRequest());
  } catch (error: any) {
    yield put(fetchConexionesFailure(error.message));
  }
}

// 🗑️ Eliminar una conexión
function* deleteConexionSaga(action: { type: string; payload: number }): Generator<any, void, any> {
  try {
    yield call(deleteConexion, action.payload);
    yield put(fetchConexionesRequest());
  } catch (error: any) {
    yield put(fetchConexionesFailure(error.message));
  }
}

function* logoutConexionSaga(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield call(logoutConexion, action.payload);
    yield put(fetchConexionesRequest()); // 🔁 Recarga la lista de conexiones
  } catch (error: any) {
    yield put(fetchConexionesFailure(error.message));
  }
}

function* createConexionSaga(action: { type: string; payload: object }): Generator<any, void, any> {
  try {
    const response: Connection = yield call(createConexion, action.payload); // ✅ importante capturar el objeto creado
    yield put({ type: AdministracionActionTypes.CREATE_CONEXION_SUCCESS });

    // ⚡ Iniciar sesión automáticamente
    yield put(startSessionRequest(response.connection_id));

    // ⚡ Refrescar lista de conexiones
    yield put(fetchConexionesRequest());
  } catch (error: any) {
    yield put({
      type: AdministracionActionTypes.CREATE_CONEXION_FAILURE,
      payload: error.message,
    });
  }
}

// 🚀 Iniciar sesión
function* startSessionSaga(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    yield call(startSesion, action.payload);
    yield put(fetchConexionesRequest()); // Actualiza status a 'pending'
  } catch (error: any) {
    yield put(fetchConexionesFailure(error.message));
  }
}

// 📷 Obtener QR
function* fetchQrSaga(action: { type: string; payload: string }): Generator<any, void, any> {
  try {
    const qrResponse = yield call(getQrCode, action.payload);

    yield put({
      type: AdministracionActionTypes.FETCH_QR_SUCCESS,
      payload: {
        qr: qrResponse.qr,
        status: qrResponse.status,
        connection_id: action.payload,
      },
    });
  } catch (error: any) {
    yield put({
      type: AdministracionActionTypes.FETCH_QR_FAILURE,
      payload: error.message,
    });
  }
}

// ✏️ Actualizar una conexión existente
function* updateConexionSaga(action: {
  type: string;
  payload: { id: number; data: Partial<Connection> };
}): Generator<any, void, any> {
  try {
    const { id, data } = action.payload;
    yield call(updateConexion, id, data); // esta función debe existir en tu archivo API
    yield put({ type: AdministracionActionTypes.UPDATE_CONEXION_SUCCESS });
    yield put(fetchConexionesRequest()); // refrescar la lista
  } catch (error: any) {
    yield put({
      type: AdministracionActionTypes.UPDATE_CONEXION_FAILURE,
      payload: error.message,
    });
  }
}

function* setAsDefaultSaga(action: { type: string; payload: number }): Generator<any, void, any> {
  try {
    yield call(setAsDefault, action.payload); // 🔵 llama al endpoint de tu API
    yield put({ type: AdministracionActionTypes.SET_AS_DEFAULT_SUCCESS });
    yield put(fetchConexionesRequest()); // 🔄 actualiza las conexiones después de marcar
  } catch (error: any) {
    yield put({
      type: AdministracionActionTypes.SET_AS_DEFAULT_FAILURE,
      payload: error.message,
    });
  }
}

// 🎯 Watchers
export default function* administracionSaga(): Generator {
  yield all([
    takeLatest(AdministracionActionTypes.FETCH_CONEXIONES_REQUEST, fetchConexionesSaga),
    takeLatest(AdministracionActionTypes.DISCONNECT_CONEXION_REQUEST, disconnectConexionSaga),
    takeLatest(AdministracionActionTypes.DELETE_CONEXION_REQUEST, deleteConexionSaga),
    takeLatest(AdministracionActionTypes.LOGOUT_CONEXION_REQUEST, logoutConexionSaga),
    takeLatest(AdministracionActionTypes.CREATE_CONEXION_REQUEST, createConexionSaga),
    takeLatest(AdministracionActionTypes.START_SESSION_REQUEST, startSessionSaga),
    takeLatest(AdministracionActionTypes.FETCH_QR_REQUEST, fetchQrSaga),
    takeLatest(AdministracionActionTypes.UPDATE_CONEXION_REQUEST, updateConexionSaga),
    takeLatest(AdministracionActionTypes.SET_AS_DEFAULT_REQUEST, setAsDefaultSaga),
  ]);
}

