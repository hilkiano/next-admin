import create from "zustand";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Icon from "@mui/material/Icon";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import ClearIcon from "@mui/icons-material/Clear";

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
  parent: "",
  setParent: (newParent) => set({ parent: newParent }),
}));

export const MenuDialog = ({ type }) => {
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
            label="Name"
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
            label="Label"
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
                    setParent("");
                  }
                }}
              />
            }
            label="Is Parent Menu"
          />
        </Grid>
        {!isParent ? (
          <Grid item xs={12} sm={12} md={12}>
            <FormControl required sx={{ minWidth: 150 }} fullWidth>
              <InputLabel id="select-parent">Parent</InputLabel>
              <Select
                labelId="select-parent"
                value={parent}
                label="Parent"
                onChange={(e) => setParent(e.target.value)}
                startAdornment={
                  <IconButton
                    onClick={(e) => setParent("")}
                    sx={{ display: parent ? "" : "none", mr: ".5em" }}
                  >
                    <ClearIcon />
                  </IconButton>
                }
              >
                {parents.map((parent) => {
                  return (
                    <MenuItem key={parent} value={parent}>
                      {parent}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Grid>
        ) : (
          <></>
        )}
        <Grid item xs={12} sm={12} md={12}>
          <TextField
            sx={{ mt: 0, mb: 0 }}
            id="url"
            label="URL"
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
            label="Icon"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            placeholder="type icon name based on Material Icon (ex. golf_course)"
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
