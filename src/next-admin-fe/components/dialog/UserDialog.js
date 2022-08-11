import create from "zustand";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

export const useUserDialogStore = create((set) => ({
  username: "",
  setUsername: (newUsername) => set({ username: newUsername }),
  name: "",
  setName: (newName) => set({ name: newName }),
  email: "",
  setEmail: (newEmail) => set({ email: newEmail }),
  rowEdit: null,
  setRowEdit: (row) => set({ rowEdit: row }),
}));

export const UserDialog = ({ type }) => {
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const { username, setUsername, name, setName, email, setEmail } =
    useUserDialogStore();
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
            id="username"
            label="Username"
            variant="outlined"
            margin="normal"
            fullWidth
            required
            value={username}
            disabled={type === "edit"}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Grid>
        <Grid item xs={2} sm={4} md={6}>
          <TextField
            sx={{ mt: 0, mb: 0, flex: 1 }}
            id="name"
            label="Display name"
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
            id="email"
            label="Email"
            variant="outlined"
            margin="normal"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
      </Grid>
    </>
  );
};
