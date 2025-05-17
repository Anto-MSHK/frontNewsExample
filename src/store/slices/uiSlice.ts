import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UiState } from "../../types";

const initialState: UiState = {
  notification: {
    open: false,
    message: "",
    type: "info",
  },
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    showNotification: (
      state,
      action: PayloadAction<{
        message: string;
        type: "success" | "info" | "warning" | "error";
      }>
    ) => {
      state.notification = {
        open: true,
        message: action.payload.message,
        type: action.payload.type,
      };
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
  },
});

export const { showNotification, hideNotification } = uiSlice.actions;
export default uiSlice.reducer;
