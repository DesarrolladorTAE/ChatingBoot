// Define la constante de acción y los tipos
export const SET_SELECTED_SECTION = "SET_SELECTED_SECTION";

export interface AtencionState {
  selectedSection: string | null;
}

export interface SetSelectedSectionAction {
  type: typeof SET_SELECTED_SECTION;
  payload: string;
}

export type AtencionActionTypes = SetSelectedSectionAction;

