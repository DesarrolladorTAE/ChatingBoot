import { takeLatest } from "redux-saga/effects";
import { SET_SELECTED_SECTION } from "./types";

function* handleSelectedSection(action: any) {
  // Aquí puedes poner lógica adicional si es necesario
  // Por ejemplo, llamadas a API o procesamiento asíncrono.
}

export function* atencionSaga() {
  yield takeLatest(SET_SELECTED_SECTION, handleSelectedSection);
}
