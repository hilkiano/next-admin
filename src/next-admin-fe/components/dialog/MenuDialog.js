import React from "react";
import create from "zustand";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import Icon from "@mui/material/Icon";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "next-i18next";

export const useMenuDialogStore = create((set) => ({
  name: "",
  setName: (newName) => set({ name: newName }),
  label: "",
  setLabel: (newLabel) => set({ label: newLabel }),
  isParent: false,
  setIsParent: (newIsParent) => set({ isParent: newIsParent }),
  url: "",
  setUrl: (newUrl) => set({ url: newUrl }),
  icon: "",
  setIcon: (newIcon) => set({ icon: newIcon }),
  rowEdit: null,
  setRowEdit: (row) => set({ rowEdit: row }),
  parents: [],
  setParents: (p) => set({ parents: p }),
  parent: null,
  setParent: (newParent) => set({ parent: newParent }),
}));

export const MenuDialog = ({ type }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    name,
    setName,
    label,
    setLabel,
    isParent,
    setIsParent,
    url,
    setUrl,
    icon,
    setIcon,
    parents,
    parent,
    setParent,
  } = useMenuDialogStore();
  return (
    <>
      <Grid
        container
        direction={matchesSm ? "column" : "row"}
        rowSpacing={2}
        spacing={matchesSm ? 1 : 2}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={2} sm={4} md={6}>
          <TextField
            sx={{ mt: 0, mb: 0 }}
            id="name"
            label={t("name", { ns: "menu" })}
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={2} sm={4} md={6}>
          <TextField
            sx={{ mt: 0, mb: 0, flex: 1 }}
            id="label"
            label={t("label", { ns: "menu" })}
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <FormControlLabel
            sx={{ mt: 0, mb: 0 }}
            control={
              <Switch
                checked={isParent}
                onChange={(e) => {
                  setIsParent(e.target.checked);
                  if (e.target.checked) {
                    setUrl("");
                    setParent(null);
                  }
                }}
              />
            }
            label={t("parent_menu", { ns: "menu" })}
          />
        </Grid>
        {!isParent ? (
          <Grid item xs={12} sm={12} md={12}>
            <Autocomplete
              clearText={t("clear")}
              closeText={t("close")}
              openText={t("open")}
              noOptionsText={t("no_options")}
              value={parent}
              id="select-parent"
              options={parents}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("parent", { ns: "menu" })}
                  placeholder={t("type_something")}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />
              )}
              onChange={(e, v) => setParent(v)}
              isOptionEqualToValue={(o, v) => o === v}
            />
          </Grid>
        ) : (
          <></>
        )}
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            sx={{ mt: 0, mb: 0 }}
            id="url"
            label={t("url", { ns: "menu" })}
            variant="outlined"
            margin="normal"
            fullWidth
            required={isParent ? false : true}
            disabled={isParent ? true : false}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            sx={{ mt: 0, mb: 0 }}
            id="icon"
            label={t("icon", { ns: "menu" })}
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder={t("icon_placeholder", { ns: "menu" })}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <Icon sx={{ color: "action.active", mr: 2, my: 0.5 }}>
                    {icon}
                  </Icon>
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};
