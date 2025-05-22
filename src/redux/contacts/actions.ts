import { ContactsActionTypes } from "./types";

// common success
export const contactsApiResponseSuccess = (actionType: string, data: any) => ({
  type: ContactsActionTypes.API_RESPONSE_SUCCESS,
  payload: { actionType, data },
});
// common error
export const contactsApiResponseError = (
  actionType: string,
  error: string
) => ({
  type: ContactsActionTypes.API_RESPONSE_ERROR,
  payload: { actionType, error },
});

export const getContacts = (filters?: object) => ({
  type: ContactsActionTypes.GET_CONTACTS,
  payload: filters,
});

export const inviteContact = (data: any) => ({
  type: ContactsActionTypes.INVITE_CONTACT,
  payload: data,
});

export const resetContacts = (flag: string, value: any) => ({
  type: ContactsActionTypes.RESET_CONTACTS,
  payload: { flag, value },
});

export const createContact = (data: any) => ({
  type: ContactsActionTypes.CREATE_CONTACT,
  payload: data,
});

export const updateContact = (id: string | number, data: any) => ({
  type: ContactsActionTypes.UPDATE_CONTACT,
  payload: { id, data },
});

export const deleteContact = (id: string | number) => ({
  type: ContactsActionTypes.DELETE_CONTACT,
  payload: id,
});

export const getContact = (id: string | number) => ({
  type: ContactsActionTypes.GET_CONTACT,
  payload: id,
});

