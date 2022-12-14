import React from "react";
import create from "zustand";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Snackbar from "@mui/material/Snackbar";
import parse from "html-react-parser";
import Router from "next/router";

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

export const errorHandling = (
  resp,
  errText = "Error",
  errStatus = "No Status"
) => {
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
      message = resp.data.message ? resp.data.message : resp.data.error;
    }
    myAlert(
      true,
      `${errText}: ${errStatus}`,
      parse(message),
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
      open={open ? open : false}
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
