import React from "react";
import create from "zustand";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import parse from "html-react-parser";

export const useMyAlertStore = create((set) => ({
  vertical: "top",
  horizontal: "right",
  duration: 6000,
  type: "info",
  message: "",
  title: "",
  variant: "filled",
  handleClose: () =>
    set({
      open: false,
    }),
  open: false,
}));

export const myAlert = (
  open = false,
  title = "",
  message = "",
  type = "info",
  vertical = "top",
  horizontal = "right",
  duration = 6000,
  variant = "filled"
) => {
  useMyAlertStore.setState({
    open,
    title,
    message,
    type,
    vertical,
    horizontal,
    duration,
    variant,
  });
};

export const errorHandling = (resp) => {
  let message = "";
  if (resp) {
    if (typeof resp.data === "object" && resp.status === 422) {
      for (const field in resp.data) {
        if (Array.isArray(resp.data[field])) {
          resp.data[field].map((msg) => {
            message += `${msg}<br />`;
          });
        }
      }
    } else {
      message = resp.data.message;
    }
    myAlert(
      true,
      `Error ${resp.status}: ${resp.statusText}`,
      parse(message),
      "error",
      "bottom",
      "right"
    );
  } else {
    myAlert(
      true,
      `Unexpected error`,
      `No response from server.`,
      "error",
      "bottom",
      "right"
    );
  }
};

export const MyAlert = () => {
  const {
    vertical,
    horizontal,
    duration,
    type,
    message,
    title,
    variant,
    open,
    handleClose,
  } = useMyAlertStore();
  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      key={vertical + horizontal}
    >
      <Alert
        onClose={handleClose}
        severity={type}
        sx={{ width: "100%" }}
        variant={variant}
      >
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};
