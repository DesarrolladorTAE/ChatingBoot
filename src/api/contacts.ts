import { APIClient } from "./apiCore";
import * as url from "./urls";

// Si tienes una interfaz Contact, úsala, si no, puedes dejarlo como any
// import { Contact } from "../../types";

const api = new APIClient();

export const getContacts = (filters?: object): Promise<any> => {
  return api.get(url.GET_CONTACTS, filters);
};

export const createContact = (data: object): Promise<any> => {
  return api.create(url.CREATE_CONTACT, data);
};

export const updateContact = (id: string | number, data: object): Promise<any> => {
  return api.update(url.UPDATE_CONTACT(id), data);
};

export const deleteContact = (id: string | number): Promise<any> => {
  return api.delete(url.DELETE_CONTACT(id));
};

export const getContact = (id: string | number): Promise<any> => {
  return api.get(url.GET_CONTACT(id));
};
