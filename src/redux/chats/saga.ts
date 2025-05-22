import { takeEvery, fork, put, all, call } from "redux-saga/effects";

// Login Redux States
import { ChatsActionTypes } from "./types";
import { chatsApiResponseSuccess, chatsApiResponseError } from "./actions";

import {
  getFavourites as getFavouritesApi,
  getDirectMessages as getDirectMessagesApi,
  getChannels as getChannelsApi,
  addContacts as addContactsApi,
  createChannel as createChannelApi,
  getchatContactDetails as getchatContactDetailsApi,
  getChatUserConversations as getChatUserConversationsApi,
  sendMessage,
  receiveMessage as receiveMessageApi,
  readMessage as readMessageApi,
  receiveMessageFromUser as receiveMessageFromUserApi,
  deleteMessage as deleteMessageApi,
  forwardMessage as forwardMessageApi,
  deleteUserMessages as deleteUserMessagesApi,
  getChannelDetails as getChannelDetailsApi,
  toggleFavouriteContact as toggleFavouriteContactApi,
  getArchiveContact as getArchiveContactApi,
  toggleArchiveContact as toggleArchiveContactApi,
  readConversation as readConversationApi,
  deleteImage as deleteImageApi,
  createConversationApi,
} from "../../api/index";

import {
  showSuccessNotification,
  showErrorNotification,
} from "../../helpers/notifications";
import type { AxiosResponse } from "axios";
import type { ConversationTicket } from "../../data";
//actions
import {
  getDirectMessages as getDirectMessagesAction,
  getFavourites as getFavouritesAction,
  getChannels as getChannelsAction,
} from "./actions";

function* getFavourites() {
  try {
    const response: Promise<any> = yield call(getFavouritesApi);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_FAVOURITES, response),
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_FAVOURITES, error));
  }
}

function* createConversation({ payload }: any): Generator<any, void, any> {
  try {
    const response: any = yield call(createConversationApi, payload.contactId);

    // Si el backend devuelve error porque ya existe, puedes mostrar el toast aquí:
    if (response.error) {
      yield call(showErrorNotification, response.error);
      yield put(chatsApiResponseError(ChatsActionTypes.CREATE_CONVERSATION, response.error));
    } else {
      yield put(chatsApiResponseSuccess(ChatsActionTypes.CREATE_CONVERSATION, response));
      yield call(showSuccessNotification, "Conversación creada correctamente");
      // Opcional: Puedes redirigir a la conversación nueva desde aquí o despachar otra acción
      // yield put(getChatUserConversations());
    }
  } catch (error: any) {
    yield call(showErrorNotification, error.message || "Error inesperado al crear la conversación");
    yield put(chatsApiResponseError(ChatsActionTypes.CREATE_CONVERSATION, error));
  }
}

// function* getDirectMessages({
//   payload: conversationId,
// }: {
//   payload: string | number;
// }): Generator<any, void, any> {
//   try {
//     const response: any = yield call(getDirectMessagesApi, conversationId);
//     yield put(
//       chatsApiResponseSuccess(ChatsActionTypes.GET_DIRECT_MESSAGES, response),
//     );
//   } catch (error: any) {
//     yield put(
//       chatsApiResponseError(ChatsActionTypes.GET_DIRECT_MESSAGES, error),
//     );
//   }
// }

function* getDirectMessages({
  payload: conversation,
}: {
  payload: { id: number; contact: any };
}): Generator<any, void, any> {
  try {
    console.log("✅ getDirectMessages recibe payload:", conversation);
    if (!conversation || typeof conversation !== "object" || !conversation.id) {
      console.error("🚨 Acción mal enviada:", conversation);
      throw new Error("conversation o conversation.id es undefined");
    }

    // Aquí llamas tu API y obtienes el objeto completo de la conversación
    const response: any = yield call(getDirectMessagesApi, conversation.id);
    console.log("✅ getDirectMessagesApi devuelve:", response);

    // Mapear los mensajes correctamente desde response.messages
    const mappedMessages = (
      Array.isArray(response.messages) ? response.messages : []
    ).map((msg: any) => ({
      ...msg,
      mId: msg.id,
      meta: { sender: msg.sender_id },
    }));

    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_DIRECT_MESSAGES, {
        id: response.id, // El id correcto de la conversación
        messages: mappedMessages,
        contact: response.contact || { id: response.id },
      }),
    );
  } catch (error: any) {
    console.error("❌ Error en saga getDirectMessages:", error);
    yield put(
      chatsApiResponseError(
        ChatsActionTypes.GET_DIRECT_MESSAGES,
        (error as any).response?.data || (error as any).message,
      ),
    );
  }
}

function* getChannels() {
  try {
    const response: Promise<any> = yield call(getChannelsApi);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.GET_CHANNELS, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.GET_CHANNELS, error));
  }
}

function* addContacts({ payload: contacts }: any) {
  try {
    const response: Promise<any> = yield call(addContactsApi, contacts);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.ADD_CONTACTS, response));
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error);
    yield put(chatsApiResponseError(ChatsActionTypes.ADD_CONTACTS, error));
  }
}
function* createChannel({ payload: channelData }: any) {
  try {
    const response: Promise<any> = yield call(createChannelApi, channelData);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.CREATE_CHANNEL, response),
    );
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error);
    yield put(chatsApiResponseError(ChatsActionTypes.CREATE_CHANNEL, error));
  }
}

function* getchatContactDetails({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getchatContactDetailsApi, id);
    yield put(
      chatsApiResponseSuccess(
        ChatsActionTypes.GET_CHAT_CONTACT_DETAILS,
        response,
      ),
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_CHAT_CONTACT_DETAILS, error),
    );
  }
}

// function* getChatUserConversations(): Generator<any, void, any> {
//   try {
//     const response: any = yield call(getChatUserConversationsApi);
//     yield put(
//       chatsApiResponseSuccess(
//         ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS,
//         response,
//       ),
//     );
//   } catch (error: any) {
//     yield put(
//       chatsApiResponseError(
//         ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS,
//         error,
//       ),
//     );
//   }
// }

function* getChatUserConversations(): Generator<any, void, any> {
  try {
    const response = yield call(getChatUserConversationsApi);
    console.log("🟢 Respuesta cruda getChatUserConversationsApi:", response);

    // CORRIGE: Usa response directamente
    const cleanedData = Array.isArray(response)
      ? response.filter(
          (c: any) =>
            c &&
            typeof c === "object" &&
            !!c.id &&
            !!(
              c.contact &&
              typeof c.contact === "object" &&
              c.contact.first_name
            ),
        )
      : [];

    yield put(
      chatsApiResponseSuccess(
        ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS,
        cleanedData,
      ),
    );
  } catch (error: any) {
    console.error("Error en saga getChatUserConversations: ", error);
    yield put(
      chatsApiResponseError(
        ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS,
        error.message || "Error inesperado en la saga.",
      ),
    );
  }
}

function* onSendMessage({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(sendMessage, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.ON_SEND_MESSAGE, response),
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.ON_SEND_MESSAGE, error));
  }
}

function* receiveMessage({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(receiveMessageApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.RECEIVE_MESSAGE, response),
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.RECEIVE_MESSAGE, error));
  }
}

function* readMessage({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(readMessageApi, id);
    yield put(chatsApiResponseSuccess(ChatsActionTypes.READ_MESSAGE, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.READ_MESSAGE, error));
  }
}

function* receiveMessageFromUser({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(receiveMessageFromUserApi, id);
    yield put(
      chatsApiResponseSuccess(
        ChatsActionTypes.RECEIVE_MESSAGE_FROM_USER,
        response,
      ),
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.RECEIVE_MESSAGE_FROM_USER, error),
    );
  }
}

function* deleteMessage({ payload: { userId, messageId } }: any) {
  try {
    const response: Promise<any> = yield call(
      deleteMessageApi,
      userId,
      messageId,
    );
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.DELETE_MESSAGE, response),
    );
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.DELETE_MESSAGE, error));
  }
}

function* forwardMessage({ payload: data }: any) {
  try {
    const response: Promise<any> = yield call(forwardMessageApi, data);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.FORWARD_MESSAGE, response),
    );
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error + "");
    yield put(chatsApiResponseError(ChatsActionTypes.FORWARD_MESSAGE, error));
  }
}

function* deleteUserMessages({ payload: userId }: any) {
  try {
    const response: Promise<any> = yield call(deleteUserMessagesApi, userId);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.DELETE_USER_MESSAGES, response),
    );
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error + "");
    yield put(
      chatsApiResponseError(ChatsActionTypes.DELETE_USER_MESSAGES, error),
    );
  }
}

function* getChannelDetails({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(getChannelDetailsApi, id);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_CHANNEL_DETAILS, response),
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_CHANNEL_DETAILS, error),
    );
  }
}

function* toggleFavouriteContact({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(toggleFavouriteContactApi, id);
    yield put(
      chatsApiResponseSuccess(
        ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT,
        response,
      ),
    );
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error + "");
    yield put(
      chatsApiResponseError(ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT, error),
    );
  }
}

function* getArchiveContact() {
  try {
    const response: Promise<any> = yield call(getArchiveContactApi);
    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.GET_ARCHIVE_CONTACT, response),
    );
  } catch (error: any) {
    yield put(
      chatsApiResponseError(ChatsActionTypes.GET_ARCHIVE_CONTACT, error),
    );
  }
}

function* toggleArchiveContact({ payload: id }: any) {
  try {
    const response: Promise<any> = yield call(toggleArchiveContactApi, id);
    yield put(
      chatsApiResponseSuccess(
        ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT,
        response,
      ),
    );
    yield call(showSuccessNotification, response + "");
  } catch (error: any) {
    yield call(showErrorNotification, error + "");
    yield put(
      chatsApiResponseError(ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT, error),
    );
  }
}

// function* readConversation({
//   payload: id,
// }: {
//   payload: string | number;
// }): Generator<any, void, any> {
//   try {
//     const response: any = yield call(readConversationApi, id);
//     yield put(
//       chatsApiResponseSuccess(ChatsActionTypes.READ_CONVERSATION, response),
//     );
//     yield put(getDirectMessagesAction(id)); // ✅ ahora sí le pasas el conversationId correcto
//     yield put(getFavouritesAction());
//     yield put(getChannelsAction());
//   } catch (error: any) {
//     yield put(chatsApiResponseError(ChatsActionTypes.READ_CONVERSATION, error));
//   }
// }

function* readConversation({
  payload: id,
}: {
  payload: string | number;
}): Generator<any, void, any> {
  try {
    const response: any = yield call(readConversationApi, id);

    yield put(
      chatsApiResponseSuccess(ChatsActionTypes.READ_CONVERSATION, response),
    );

    // 👇 Aquí extraemos contact desde el response de la conversación
    const conversation = response;
    const contact = conversation.contact;

    yield put(getDirectMessagesAction({ id, contact }));

    yield put(getFavouritesAction());
    yield put(getChannelsAction());
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.READ_CONVERSATION, error));
  }
}

function* deleteImage({ payload: { userId, messageId, imageId } }: any) {
  try {
    const response: Promise<any> = yield call(
      deleteImageApi,
      userId,
      messageId,
      imageId,
    );
    yield put(chatsApiResponseSuccess(ChatsActionTypes.DELETE_IMAGE, response));
  } catch (error: any) {
    yield put(chatsApiResponseError(ChatsActionTypes.DELETE_IMAGE, error));
  }
}

export function* watchCreateConversation() {
  yield takeEvery(ChatsActionTypes.CREATE_CONVERSATION, createConversation);
}

export function* watchGetFavourites() {
  yield takeEvery(ChatsActionTypes.GET_FAVOURITES, getFavourites);
}

export function* watchGetDirectMessages(): Generator {
  yield takeEvery("@@chats/GET_DIRECT_MESSAGES" as any, getDirectMessages);
}
export function* watchGetChannels() {
  yield takeEvery(ChatsActionTypes.GET_CHANNELS, getChannels);
}
export function* watchAddContacts() {
  yield takeEvery(ChatsActionTypes.ADD_CONTACTS, addContacts);
}
export function* watchCreateChannel() {
  yield takeEvery(ChatsActionTypes.CREATE_CHANNEL, createChannel);
}
export function* watchGetchatContactDetails() {
  yield takeEvery(
    ChatsActionTypes.GET_CHAT_CONTACT_DETAILS,
    getchatContactDetails,
  );
}
export function* watchGetChatUserConversations() {
  yield takeEvery(
    ChatsActionTypes.GET_CHAT_USER_CONVERSATIONS,
    getChatUserConversations,
  );
}
export function* watchOnSendMessage() {
  yield takeEvery(ChatsActionTypes.ON_SEND_MESSAGE, onSendMessage);
}
export function* watchReceiveMessage() {
  yield takeEvery(ChatsActionTypes.RECEIVE_MESSAGE, receiveMessage);
}
export function* watchReadMessage() {
  yield takeEvery(ChatsActionTypes.READ_MESSAGE, readMessage);
}
export function* watchReceiveMessageFromUser() {
  yield takeEvery(
    ChatsActionTypes.RECEIVE_MESSAGE_FROM_USER,
    receiveMessageFromUser,
  );
}
export function* watchDeleteMessage() {
  yield takeEvery(ChatsActionTypes.DELETE_MESSAGE, deleteMessage);
}
export function* watchForwardMessage() {
  yield takeEvery(ChatsActionTypes.FORWARD_MESSAGE, forwardMessage);
}
export function* watchDeleteUserMessages() {
  yield takeEvery(ChatsActionTypes.DELETE_USER_MESSAGES, deleteUserMessages);
}
export function* watchGetChannelDetails() {
  yield takeEvery(ChatsActionTypes.GET_CHANNEL_DETAILS, getChannelDetails);
}
export function* watchToggleFavouriteContact() {
  yield takeEvery(
    ChatsActionTypes.TOGGLE_FAVOURITE_CONTACT,
    toggleFavouriteContact,
  );
}
export function* watchGetArchiveContact() {
  yield takeEvery(ChatsActionTypes.GET_ARCHIVE_CONTACT, getArchiveContact);
}
export function* watchToggleArchiveContact() {
  yield takeEvery(
    ChatsActionTypes.TOGGLE_ARCHIVE_CONTACT,
    toggleArchiveContact,
  );
}
export function* watchReadConversation() {
  yield takeEvery(ChatsActionTypes.READ_CONVERSATION as any, readConversation);
}
export function* watchDeleteImage() {
  yield takeEvery(ChatsActionTypes.DELETE_IMAGE, deleteImage);
}

function* chatsSaga() {
  yield all([
    fork(watchCreateConversation),
    fork(watchGetFavourites),
    fork(watchGetDirectMessages),
    fork(watchGetChannels),
    fork(watchAddContacts),
    fork(watchCreateChannel),
    fork(watchGetchatContactDetails),
    fork(watchGetChatUserConversations),
    fork(watchOnSendMessage),
    fork(watchReceiveMessage),
    fork(watchReadMessage),
    fork(watchReceiveMessageFromUser),
    fork(watchDeleteMessage),
    fork(watchForwardMessage),
    fork(watchDeleteUserMessages),
    fork(watchGetChannelDetails),
    fork(watchToggleFavouriteContact),
    fork(watchGetArchiveContact),
    fork(watchToggleArchiveContact),
    fork(watchReadConversation),
    fork(watchDeleteImage),
  ]);
}

export default chatsSaga;
