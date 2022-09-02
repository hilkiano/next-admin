import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Tooltip from "@mui/material/Tooltip";

import { errorHandling, MyAlert, myAlert } from "../reusable/MyAlert";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoginIcon from "@mui/icons-material/Login";

import { userService } from "../../services/userService";
import { useAuthStore } from "../store/AuthStore";
import { useMyAvatarStore } from "../reusable/MyAvatar";

export default function LoginPage(props) {
  const { t } = useTranslation(["login", "common"]);
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
      if (!res.status) {
        setLoading(false);
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        router.push("/");
      }
    });
  };

  return (
    <>
      <Head>
        <title>{t("login_page")}</title>
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
              <Typography variant="h4">{t("login")}</Typography>
              <form onSubmit={(e) => e.preventDefault()}>
                <TextField
                  id="username"
                  label={t("username", { ns: "common" })}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                  id="password"
                  label={t("password", { ns: "common" })}
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip
                          title={
                            showPassword
                              ? t("show_password")
                              : t("hide_password")
                          }
                        >
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
                <Divider sx={{ mt: "1em" }} />
                <LoadingButton
                  loading={loading}
                  loadingPosition="start"
                  startIcon={<LoginIcon />}
                  variant="contained"
                  fullWidth
                  sx={{ mt: "1em" }}
                  onClick={loginHandler}
                  size="large"
                  type="submit"
                >
                  {t("login")}
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
