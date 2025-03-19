import { AtencionState, AtencionActionTypes, SET_SELECTED_SECTION } from "./types";

const initialState: AtencionState = {
  selectedSection: null,
};

function Atencion(
    state = initialState,
    action: AtencionActionTypes
  ): AtencionState {
    switch (action.type) {
      case SET_SELECTED_SECTION:
        return { ...state, selectedSection: action.payload };
      default:
        return state;
    }
  }
  
  export default Atencion;
  