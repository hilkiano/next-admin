import React, { useEffect } from "react";
import create from "zustand";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import ImageIcon from "@mui/icons-material/Image";

export const useUpdateUserInfoDialogStore = create((set) => ({
  dName: "",
  setDName: (newName) => set({ dName: newName }),
  dImg: null,
  setDImg: (newImg) => set({ dImg: newImg }),
  dPreviewUrl: null,
  setDPreviewUrl: (newUrl) => set({ dPreviewUrl: newUrl }),
}));

export const UpdateUserInfoDialog = (props) => {
  const { t } = useTranslation(["common", "home"]);
  const { name } = props;
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { dName, setDName, dImg, setDImg, dPreviewUrl, setDPreviewUrl } =
    useUpdateUserInfoDialogStore();

  const onSelectImage = (e) => {
    setDImg(e.target.files[0]);
  };

  useEffect(() => {
    setDName(name);
  }, []);

  useEffect(() => {
    if (!dImg && !dPreviewUrl) {
      setDPreviewUrl(null);
      return;
    }
    const objectUrl = dImg ? URL.createObjectURL(dImg) : dPreviewUrl;
    setDPreviewUrl(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [dImg]);

  return (
    <Grid
      container
      direction={matchesSm ? "column" : "row"}
      rowSpacing={2}
      spacing={matchesSm ? 1 : 2}
    >
      <Grid item xs={12} sm={5} md={5}>
        {dImg ? (
          <Image
            src={
              useUpdateUserInfoDialogStore.getState().dPreviewUrl
                ? useUpdateUserInfoDialogStore.getState().dPreviewUrl
                : "/no_image.png"
            }
            alt="me"
            width="200"
            height="200"
            objectFit="cover"
          />
        ) : !dImg && dPreviewUrl ? (
          <Image
            src={dPreviewUrl}
            alt="me"
            width="200"
            height="200"
            objectFit="cover"
          />
        ) : (
          <Image
            src="/no_image.png"
            alt="me"
            width="200"
            height="200"
            objectFit="cover"
          />
        )}
      </Grid>
      <Grid item container xs={12} sm={7} md={7} alignContent="baseline">
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            sx={{ mt: 0, mb: 0 }}
            id="name"
            label={t("name", { ns: "common" })}
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={dName}
            onChange={(e) => setDName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Button
            sx={{ mt: "1em" }}
            variant="outlined"
            component="label"
            startIcon={<ImageIcon />}
          >
            {t("button.choose_image", { ns: "home" })}
            <input
              accept="image/*"
              type="file"
              onChange={onSelectImage}
              hidden
            />
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};
