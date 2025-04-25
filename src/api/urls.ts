//auth
export const POST_FAKE_LOGIN = "/post-fake-login";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_JWT_LOGIN = "/login";
export const POST_FAKE_LOGOUT = "/post-fake-logout";
export const POST_FAKE_PASSWORD_FORGET = "/fake-forget-pwd";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";
export const JWT_REGISTER = "/post-jwt-register";
export const POST_FAKE_REGISTER = "/post-fake-register";

export const USER_CHANGE_PASSWORD = "/user-change-password";

// profile & settings
export const GET_PROFILE_DETAILS = "/profile-details";
export const GET_USER_SETTINGS = "/user-settings";
export const UPDATE_ETTINGS = "/update-user-settings";

// contacts
export const GET_CONTACTS = "/user-contacts";
export const INVITE_CONTACT = "/invite-contact";

// calls
export const GET_CALLS_LIST = "/calls-list";

// bookmarks
export const GET_BOOKMARKS_LIST = "/bookmarks-list";
export const DELETE_BOOKMARK = "/bookmarks-delete";
export const UPDATE_BOOKMARK = "/bookmarks-update";

// chats
export const GET_FAVOURITES = "/get-favourites";
export const GET_DIRECT_MESSAGES = "/get-direct-messages";
export const GET_CHANNELS = "/get-channles";
export const ADD_CONTACTS = "/add-contact";
export const CREATE_CHANNEL = "/create-channel";
export const GET_CHAT_USER_DETAILS = "/get-user-details";
export const GET_CHAT_USER_CONVERSATIONS = "/get-user-conversations";
export const SEND_MESSAGE = "/send-message";
export const RECEIVE_MESSAGE = "/receive-message";
export const READ_MESSAGE = "/read-message";
export const RECEIVE_MESSAGE_FROM_USER = "/receive-message-from-user";
export const DELETE_MESSAGE = "/delete-message";
export const FORWARD_MESSAGE = "/forward-message";
export const DELETE_USER_MESSAGES = "/delete-user-messages";
export const TOGGLE_FAVOURITE_CONTACT = "/toggle-favourite-contact";
export const GET_ARCHIVE_CONTACT = "/get-archive-contacts";
export const TOGGLE_ARCHIVE_CONTACT = "/toggle-archive-contact";
export const READ_CONVERSATION = "/read-conversation";
export const DELETE_IMAGE = "/user-delete-img";

// Conexiones (Administración)
export const GET_CONEXIONES = "/connections"; // GET todas las conexiones
export const CREATE_CONEXION = "/connections"; // POST nueva conexión
export const DELETE_CONEXION = (id: number) => `/connections/${id}`; // DELETE por ID
export const UPDATE_CONEXION = (id: number) => `/connections/${id}`; // PUT por ID
export const SET_CONEXION_DEFAULT = (id: number) => `/connections/${id}/set-default`; // POST para hacerla predeterminada

// Acciones de sesión vía WA Controller
export const DISCONNECT_SESSION = (id: string) => `/wa/disconnect/${id}`; // POST para desconectar sesión
// Iniciar sesión manualmente (Node.js backend inicia la sesión)
export const START_SESSION = "/wa/start"; // POST con { connectionId }
// Obtener código QR de una sesión
export const GET_QR_CODE = (id: string) => `/wa/qr/${id}`; // GET


// groups
export const GET_CHANNEL_DETAILS = "/get-channel-details";
