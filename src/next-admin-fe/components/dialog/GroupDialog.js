import React, { useEffect } from "react";
import create from "zustand";
import Grid from "@mui/material/Grid";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import CircularProgress from "@mui/material/CircularProgress";

export const useGroupDialogStore = create((set) => ({
  name: "",
  setName: (newName) => set({ name: newName }),
  description: "",
  setDescription: (newDesc) => set({ description: newDesc }),
  users: [],
  setUsers: (newUsers) => set({ users: newUsers }),
  listUsers: [],
  setListUsers: (newList) => set({ listUsers: newList }),
  roles: [],
  setRoles: (newRoles) => set({ roles: newRoles }),
  listRoles: [],
  setListRoles: (newList) => set({ listRoles: newList }),
  rowEdit: null,
  setRowEdit: (row) => set({ rowEdit: row }),
  reloadListFunc: () => {},
  dropdownLoading: false,
}));

export const GroupDialog = ({ type }) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    name,
    setName,
    description,
    setDescription,
    users,
    setUsers,
    listUsers,
    roles,
    setRoles,
    listRoles,
    reloadListFunc,
    dropdownLoading,
  } = useGroupDialogStore();

  return (
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
          label="Name"
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
          sx={{ mt: 0, mb: 0 }}
          id="description"
          label="Description"
          variant="outlined"
          margin="normal"
          rows={4}
          multiline
          fullWidth
          required
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Autocomplete
          value={users}
          multiple
          id="select-user"
          options={listUsers}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          disabled={dropdownLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Users"
              placeholder="Type something..."
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
          onChange={(e, v) => setUsers(v)}
          disableCloseOnSelect
          loading={dropdownLoading}
          isOptionEqualToValue={(o, v) => o.id === v.id}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <Autocomplete
          value={roles}
          multiple
          id="select-role"
          options={listRoles.sort((a, b) => a.name.localeCompare(b.name))}
          getOptionLabel={(option) => option.name}
          filterSelectedOptions
          disabled={dropdownLoading}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Roles"
              placeholder="Type something..."
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
          onChange={(e, v) => setRoles(v)}
          disableCloseOnSelect
          loading={dropdownLoading}
          isOptionEqualToValue={(o, v) => o.id === v.id}
        />
      </Grid>
    </Grid>
  );
};
