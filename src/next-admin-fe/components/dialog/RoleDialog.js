import React from "react";
import create from "zustand";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { useTranslation } from "next-i18next";

export const useRoleDialogStore = create((set) => ({
  name: "",
  setName: (newName) => set({ name: newName }),
  description: "",
  setDescription: (newDesc) => set({ description: newDesc }),
  privs: [],
  setPrivs: (newPrivs) => set({ privs: newPrivs }),
  listPrivs: [],
  setListPrivs: (newList) => set({ listPrivs: newList }),
  rowEdit: null,
  setRowEdit: (row) => set({ rowEdit: row }),
  dropdownLoading: false,
  setDropdownLoading: (e) => set({ dropdownLoading: e }),
}));

export const RoleDialog = ({ type }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    name,
    setName,
    description,
    setDescription,
    privs,
    setPrivs,
    listPrivs,
    dropdownLoading,
  } = useRoleDialogStore();
  return (
    <>
      <Grid
        container
        direction={matchesSm ? "column" : "row"}
        rowSpacing={2}
        spacing={matchesSm ? 1 : 2}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            sx={{ mt: 0, mb: 0 }}
            id="name"
            label={t("name", { ns: "role" })}
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            multiline
            rows={4}
            sx={{ mt: 0, mb: 0, flex: 1 }}
            id="desc"
            label={t("description", { ns: "role" })}
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <Autocomplete
            clearText={t("clear")}
            closeText={t("close")}
            openText={t("open")}
            noOptionsText={t("no_options")}
            value={privs}
            multiple
            id="select-priv"
            options={listPrivs}
            getOptionLabel={(option) => option.name}
            filterSelectedOptions
            disabled={dropdownLoading}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("privileges", { ns: "role" })}
                placeholder={t("type_something")}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <React.Fragment>
                      {dropdownLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : null}
                      {params.InputProps.endAdornment}
                    </React.Fragment>
                  ),
                }}
              />
            )}
            onChange={(e, v) => setPrivs(v)}
            disableCloseOnSelect
            loading={dropdownLoading}
            isOptionEqualToValue={(o, v) => o.id === v.id}
          />
        </Grid>
      </Grid>
    </>
  );
};
