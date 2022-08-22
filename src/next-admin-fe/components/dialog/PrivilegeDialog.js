import create from "zustand";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "next-i18next";

export const usePrivilegeDialogStore = create((set) => ({
  name: "",
  setName: (newName) => set({ name: newName }),
  description: "",
  setDescription: (newDesc) => set({ description: newDesc }),
  rowEdit: null,
  setRowEdit: (row) => set({ rowEdit: row }),
}));

export const PrivilegeDialog = ({ type }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { name, setName, description, setDescription } =
    usePrivilegeDialogStore();
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
            label={t("name", { ns: "privilege" })}
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
            label={t("description", { ns: "privilege" })}
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
      </Grid>
    </>
  );
};
