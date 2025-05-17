import React from "react";
import { Alert, Snackbar } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../hooks/redux";
import { hideNotification } from "../store/slices/uiSlice";

const Notification: React.FC = () => {
  const dispatch = useAppDispatch();
  const { open, message, type } = useAppSelector(
    (state) => state.ui.notification
  );

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(hideNotification());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
