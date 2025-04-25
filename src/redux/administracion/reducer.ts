// redux/administracion/reducer.ts
import {
  AdministracionState,
  Connection,
  AdministracionActionTypes,
} from "./types";

const initialState: AdministracionState = {
  conexiones: {
    list: [],
    loading: false,
    error: null,
  },
  qrCode: {
    qr: null,
    status: null,
    loading: false,
    error: null,
  },
};

type Action =
  | { type: AdministracionActionTypes.FETCH_CONEXIONES_REQUEST }
  | {
      type: AdministracionActionTypes.FETCH_CONEXIONES_SUCCESS;
      payload: Connection[];
    }
  | {
      type: AdministracionActionTypes.FETCH_CONEXIONES_FAILURE;
      payload: string;
    }
  | {
      type:
        | AdministracionActionTypes.DISCONNECT_CONEXION_REQUEST
        | AdministracionActionTypes.DELETE_CONEXION_REQUEST;
    }
  | {
      type:
        | AdministracionActionTypes.DISCONNECT_CONEXION_SUCCESS
        | AdministracionActionTypes.DELETE_CONEXION_SUCCESS;
    }
  | { type: AdministracionActionTypes.CREATE_CONEXION_REQUEST }
  | { type: AdministracionActionTypes.CREATE_CONEXION_SUCCESS }
  | {
      type: AdministracionActionTypes.CREATE_CONEXION_FAILURE;
      payload: string;
    }
  | { type: AdministracionActionTypes.FETCH_QR_REQUEST }
  | {
      type: AdministracionActionTypes.FETCH_QR_SUCCESS;
      payload: { qr: string; status: string };
    }
  | {
      type: AdministracionActionTypes.FETCH_QR_FAILURE;
      payload: string;
    }
  | { type: AdministracionActionTypes.CLEAR_QR_CODE } // ✅ aquí

  | { type: AdministracionActionTypes.UPDATE_CONEXION_REQUEST }
  | { type: AdministracionActionTypes.UPDATE_CONEXION_SUCCESS }
  | {
    type: AdministracionActionTypes.UPDATE_CONEXION_FAILURE;
    payload: string;
    }

const Administracion = (
  state = initialState,
  action: Action,
): AdministracionState => {
  switch (action.type) {
    case AdministracionActionTypes.FETCH_CONEXIONES_REQUEST:
      return {
        ...state,
        conexiones: { ...state.conexiones, loading: true, error: null },
      };
    case AdministracionActionTypes.FETCH_CONEXIONES_SUCCESS:
      return {
        ...state,
        conexiones: { list: action.payload, loading: false, error: null },
      };
    case AdministracionActionTypes.FETCH_CONEXIONES_FAILURE:
      return {
        ...state,
        conexiones: {
          ...state.conexiones,
          loading: false,
          error: action.payload,
        },
      };
    case AdministracionActionTypes.DISCONNECT_CONEXION_REQUEST:
    case AdministracionActionTypes.DELETE_CONEXION_REQUEST:
      return {
        ...state,
        conexiones: { ...state.conexiones, loading: true },
      };
    case AdministracionActionTypes.DISCONNECT_CONEXION_SUCCESS:
    case AdministracionActionTypes.DELETE_CONEXION_SUCCESS:
      return {
        ...state,
        conexiones: { ...state.conexiones, loading: false },
      };
    case AdministracionActionTypes.CREATE_CONEXION_REQUEST:
      return {
        ...state,
        conexiones: { ...state.conexiones, loading: true, error: null },
      };
    case AdministracionActionTypes.CREATE_CONEXION_SUCCESS:
      return {
        ...state,
        conexiones: { ...state.conexiones, loading: false },
      };
    case AdministracionActionTypes.CREATE_CONEXION_FAILURE:
      return {
        ...state,
        conexiones: {
          ...state.conexiones,
          loading: false,
          error: action.payload,
        },
      };
    case AdministracionActionTypes.FETCH_QR_REQUEST:
      return {
        ...state,
        qrCode: {
          qr: null,
          status: null,
          loading: true,
          error: null,
        },
      };
    case AdministracionActionTypes.FETCH_QR_SUCCESS:
      return {
        ...state,
        qrCode: {
          qr: action.payload.qr,
          status: action.payload.status,
          loading: false,
          error: null,
        },
      };
    case AdministracionActionTypes.FETCH_QR_FAILURE:
      return {
        ...state,
        qrCode: {
          qr: null,
          status: null,
          loading: false,
          error: action.payload,
        },
      };
    case AdministracionActionTypes.CLEAR_QR_CODE:
      return {
        ...state,
        qrCode: {
          qr: null,
          status: null,
          loading: false,
          error: null,
        },
      };
    case AdministracionActionTypes.UPDATE_CONEXION_REQUEST:
      return {
        ...state,
        conexiones: { ...state.conexiones, loading: true, error: null },
      };
    case AdministracionActionTypes.UPDATE_CONEXION_SUCCESS:
      return {
        ...state,
        conexiones: { ...state.conexiones, loading: false },
      };
    case AdministracionActionTypes.UPDATE_CONEXION_FAILURE:
      return {
        ...state,
        conexiones: {
          ...state.conexiones,
          loading: false,
          error: action.payload,
        },
      };

    default:
      return state;
  }
};

export default Administracion;
