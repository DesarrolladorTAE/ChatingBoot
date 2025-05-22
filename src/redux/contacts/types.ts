export enum ContactsActionTypes {
  API_RESPONSE_SUCCESS = "@@contacts/API_RESPONSE_SUCCESS",
  API_RESPONSE_ERROR = "@@contacts/API_RESPONSE_ERROR",

  GET_CONTACTS = "@@contacts/GET_CONTACTS",
  RESET_CONTACTS = "@@contacts/RESET_CONTACTS",
  INVITE_CONTACT = "@@contacts/INVITE_CONTACT",
  CREATE_CONTACT = "@@contacts/CREATE_CONTACT",
  UPDATE_CONTACT = "@@contacts/UPDATE_CONTACT",
  DELETE_CONTACT = "@@contacts/DELETE_CONTACT",
  GET_CONTACT = "@@contacts/GET_CONTACT",
}
export interface ContactsState {
  contacts: Array<any>;
}
