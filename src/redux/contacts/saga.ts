import { takeEvery, fork, put, all, call } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { ContactsActionTypes } from "./types";
import {
  contactsApiResponseSuccess,
  contactsApiResponseError,
} from "./actions";

// Importa tus métodos reales
import {
  getContacts as getContactsApi,
  createContact as createContactApi,
  updateContact as updateContactApi,
  deleteContact as deleteContactApi,
  getContact as getContactApi,
} from "../../api/index";

// helpers
import {
  showSuccessNotification,
  showErrorNotification,
} from "../../helpers/notifications";

function mapContactFromApi(apiContact: any) {
  return {
    id: apiContact.id,
    firstName: apiContact.first_name,
    lastName: apiContact.last_name,
    profileImage: apiContact.profile_image,
    email: apiContact.email,
    phone: apiContact.phone,
    ownerId: apiContact.owner_id,
    createdAt: apiContact.created_at,
    updatedAt: apiContact.updated_at,
    lastSeenAt: apiContact.last_seen_at,
  };
}

// GET ALL
export function* getContacts({ payload: filters }: any): SagaIterator {
  try {
    const response: any[] = yield call(getContactsApi, filters);
    const mappedContacts = Array.isArray(response)
      ? response.map(mapContactFromApi)
      : [];
    yield put(
      contactsApiResponseSuccess(ContactsActionTypes.GET_CONTACTS, mappedContacts)
    );
  } catch (error: any) {
    yield put(
      contactsApiResponseError(ContactsActionTypes.GET_CONTACTS, error)
    );
  }
}

// CREATE
function* createContact({ payload }: any): SagaIterator {
  try {
    const response: any = yield call(createContactApi, payload);
    yield put(
      contactsApiResponseSuccess(ContactsActionTypes.CREATE_CONTACT, response)
    );
    yield call(showSuccessNotification, "Contacto creado correctamente");
    // Opcional: volver a obtener todos los contactos
    // yield put({ type: ContactsActionTypes.GET_CONTACTS });
  } catch (error: any) {
    yield call(showErrorNotification, error);
    yield put(
      contactsApiResponseError(ContactsActionTypes.CREATE_CONTACT, error)
    );
  }
}

// UPDATE
function* updateContact({ payload }: any): SagaIterator {
  try {
    const { id, data } = payload;
    const response: any = yield call(updateContactApi, id, data);
    yield put(
      contactsApiResponseSuccess(ContactsActionTypes.UPDATE_CONTACT, response)
    );
    yield call(showSuccessNotification, "Contacto actualizado correctamente");
    // Opcional: volver a obtener todos los contactos
    // yield put({ type: ContactsActionTypes.GET_CONTACTS });
  } catch (error: any) {
    yield call(showErrorNotification, error);
    yield put(
      contactsApiResponseError(ContactsActionTypes.UPDATE_CONTACT, error)
    );
  }
}

// DELETE
function* deleteContact({ payload }: any): SagaIterator {
  try {
    yield call(deleteContactApi, payload); // payload = id
    yield put(
      contactsApiResponseSuccess(ContactsActionTypes.DELETE_CONTACT, payload)
    );
    yield call(showSuccessNotification, "Contacto eliminado correctamente");
    // Opcional: volver a obtener todos los contactos
    // yield put({ type: ContactsActionTypes.GET_CONTACTS });
  } catch (error: any) {
    yield call(showErrorNotification, error);
    yield put(
      contactsApiResponseError(ContactsActionTypes.DELETE_CONTACT, error)
    );
  }
}

// GET ONE (opcional)
function* getContact({ payload }: any): SagaIterator {
  try {
    const response: any = yield call(getContactApi, payload); // payload = id
    yield put(
      contactsApiResponseSuccess(ContactsActionTypes.GET_CONTACT, response)
    );
  } catch (error: any) {
    yield put(
      contactsApiResponseError(ContactsActionTypes.GET_CONTACT, error)
    );
  }
}

// Watchers
export function* watchGetContacts(): SagaIterator {
  yield takeEvery(ContactsActionTypes.GET_CONTACTS, getContacts);
}
export function* watchCreateContact(): SagaIterator {
  yield takeEvery(ContactsActionTypes.CREATE_CONTACT, createContact);
}
export function* watchUpdateContact(): SagaIterator {
  yield takeEvery(ContactsActionTypes.UPDATE_CONTACT, updateContact);
}
export function* watchDeleteContact(): SagaIterator {
  yield takeEvery(ContactsActionTypes.DELETE_CONTACT, deleteContact);
}
export function* watchGetContact(): SagaIterator {
  yield takeEvery(ContactsActionTypes.GET_CONTACT, getContact);
}

// Root saga
function* contactsSaga(): SagaIterator {
  yield all([
    fork(watchGetContacts),
    fork(watchCreateContact),
    fork(watchUpdateContact),
    fork(watchDeleteContact),
    fork(watchGetContact),
    // Si usas inviteContact, déjalo aquí, si no, elimínalo
    // fork(watchInviteContact),
  ]);
}

export default contactsSaga;
