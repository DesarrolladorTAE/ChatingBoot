import { SET_SELECTED_SECTION, SetSelectedSectionAction } from "./types";

export function setSelectedSection(section: string): SetSelectedSectionAction {
  return {
    type: SET_SELECTED_SECTION,
    payload: section,
  };
}
