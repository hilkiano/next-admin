import React, { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import parse from "html-react-parser";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";

import { MyAlert, myAlert } from "../reusable/MyAlert";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { userService } from "../../services/userService";
import { useAuthStore } from "../store/AuthStore";
import { useMyAvatarStore } from "../reusable/MyAvatar";

export default function LoginPage(props) {
  const setUser = useAuthStore((state) => state.setUser);
  const setName = useMyAvatarStore((state) => state.setName);
  const theme = useTheme();
  const router = useRouter();
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const loginHandler = () => {
    setLoading(true);
    userService.login(username, password).then((res) => {
      setLoading(false);
      if (!res.status) {
        openSnackbar("error", res.data);
      } else {
        localStorage.setItem(
          "token",
          Buffer.from(res.data.data.token, "utf8").toString("base64")
        );
        localStorage.setItem("user", JSON.stringify(res.data.data.user));
        localStorage.setItem("menus", JSON.stringify(res.data.data.menus));
        setUser(res.data.data.user);
        setName(res.data.data.user.name);
        router.push("/");
      }
    });
  };

  const openSnackbar = (state, resp) => {
    let message = "";
    if (state === "error" && resp) {
      if (typeof resp.data === "object" && resp.status === 422) {
        for (const field in resp.data) {
          if (Array.isArray(resp.data[field])) {
            resp.data[field].map((msg) => {
              message += `${msg}<br />`;
            });
          }
        }
      } else {
        message = resp.data.message;
      }
      myAlert(
        true,
        `Error ${resp.status}: ${resp.statusText}`,
        parse(message),
        state
      );
    } else {
      myAlert(true, `Unexpected error`, `No response from server.`, state);
    }
  };

  return (
    <>
      <Head>
        <title>Login Page</title>
      </Head>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: "100vh" }}
      >
        <Grid item xs={3}>
          <Card
            sx={{ minWidth: "360px", maxWidth: "400px" }}
            elevation={matchesSm ? 0 : 6}
          >
            <CardContent>
              <Typography variant="h4">Login</Typography>
              <form onSubmit={(e) => e.preventDefault()}>
                <TextField
                  id="username"
                  label="Username"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  id="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <LoadingButton
                  loading={loading}
                  loadingIndicator="Please wait…"
                  variant="contained"
                  fullWidth
                  sx={{ mt: "1em" }}
                  onClick={loginHandler}
                  size="large"
                  type="submit"
                >
                  Login
                </LoadingButton>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <MyAlert />
    </>
  );
}
