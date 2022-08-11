import React from "react";
import create from "zustand";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

export const useMyBackdropStore = create((set) => ({
  open: false,
  progressIndicator: true,
  indicatorSize: 50,
  textVariant: "h4",
  message: "Loading",
  type: "light",
  transparency: true,
  appearMs: 200,
  enterMs: 200,
  exitMs: 200,
}));

export const myBackdrop = (
  open = false,
  message = "Loading",
  textVariant = "h4",
  type = "dark",
  progressIndicator = true,
  indicatorSize = 50,
  transparency = true,
  appearMs = 200,
  enterMs = 200,
  exitMs = 200
) => {
  useMyBackdropStore.setState({
    open,
    message,
    textVariant,
    type,
    progressIndicator,
    indicatorSize,
    transparency,
    appearMs,
    enterMs,
    exitMs,
  });
};

export const MyBackdrop = () => {
  const {
    open,
    progressIndicator,
    indicatorSize,
    textVariant,
    message,
    type,
    transparency,
    appearMs,
    enterMs,
    exitMs,
  } = useMyBackdropStore();
  return (
    <Backdrop
      sx={{
        zIndex: (theme) => theme.zIndex.tooltip + 1,
        color: type === "light" ? "#000" : type === "dark" ? "#fff" : "#fff",
        backgroundColor:
          type === "light" && transparency
            ? "rgba(255, 255, 255, 0.75)"
            : type === "light" && !transparency
            ? "rgb(255, 255, 255)"
            : type === "dark" && transparency
            ? "rgba(0, 0, 0, 0.75)"
            : type === "dark" && !transparency
            ? "rgb(0, 0, 0)"
            : "rgb(0, 0, 0)",
      }}
      open={open}
      transitionDuration={{
        appear: appearMs,
        enter: enterMs,
        exit: exitMs,
      }}
    >
      <Typography variant={textVariant}>{message}</Typography>
      {progressIndicator ? (
        <CircularProgress
          sx={{ ml: "1em" }}
          size={indicatorSize}
          color="inherit"
        />
      ) : (
        <></>
      )}
    </Backdrop>
  );
};
