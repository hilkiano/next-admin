import React from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import create from "zustand";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import LinearProgress from "@mui/material/LinearProgress";
import Backdrop from "@mui/material/Backdrop";

export const useMyDialogStore = create((set) => ({
  open: false,
  setOpen: (o) => set({ open: o }),
  handleClose: (event, reason) => {
    if (reason !== "backdropClick") {
      set({ open: false });
    }
  },
  type: "confirm",
  title: "",
  content: null,
  maxWidth: "xs",
  positiveAction: () => {},
  yesBtn: "Yes",
  negativeAction: () => {},
  noBtn: "No",
  loading: false,
  setLoading: (l) => set({ loading: l }),
}));

export const myDialog = (
  open = false,
  type = "confirm",
  title = null,
  content = null,
  maxWidth = "xs",
  positiveAction = () => {},
  yesBtn = "Yes",
  negativeAction = () => {},
  noBtn = "No"
) => {
  useMyDialogStore.setState({
    open,
    type,
    title,
    content,
    maxWidth,
    positiveAction,
    yesBtn,
    negativeAction,
    noBtn,
  });
};

export const MyDialog = () => {
  const {
    open,
    handleClose,
    type,
    title,
    content,
    maxWidth,
    positiveAction,
    yesBtn,
    negativeAction,
    noBtn,
    loading,
  } = useMyDialogStore();
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open ? open : false}
      onClose={handleClose}
      fullWidth
      maxWidth={maxWidth}
      disableEscapeKeyDown
      fullScreen={matchesSm && type === "form" ? true : false}
    >
      {loading ? (
        <LinearProgress />
      ) : (
        <LinearProgress variant="determinate" value={0} />
      )}
      <DialogTitle>{title}</DialogTitle>
      <DialogContent dividers>
        {type === "confirm" ? (
          <DialogContentText>{content}</DialogContentText>
        ) : (
          content
        )}
      </DialogContent>
      <DialogActions sx={{ p: "1em" }}>
        <Button onClick={negativeAction}>{noBtn}</Button>
        <Button
          disableElevation
          disabled={loading}
          variant="contained"
          onClick={positiveAction}
        >
          {yesBtn}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
