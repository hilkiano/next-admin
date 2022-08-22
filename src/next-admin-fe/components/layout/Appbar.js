import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTranslation } from "next-i18next";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";

import MenuIcon from "@mui/icons-material/Menu";

import { userService } from "../../services/userService";
import {
  MyBackdrop,
  myBackdrop,
  useMyBackdropStore,
} from "../reusable/MyBackdrop";
import { MyDialog, myDialog, useMyDialogStore } from "../reusable/MyDialog";
import { useAuthStore } from "../store/AuthStore";
import { useMyAvatarStore, MyAvatar } from "../reusable/MyAvatar";

export default function Appbar({ title, handleDrawerToggle, user }) {
  const { t } = useTranslation();
  const router = useRouter();
  const theme = useTheme();
  const { name, setName, setImgUrl } = useMyAvatarStore();

  const [loading, setLoading] = useState(false);
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElUser(null);
  };

  const logoutHandler = () => {
    myBackdrop(true, t("logging_out"), "h5", "dark", true, 30, true);
    userService.logout().then((res) => {
      if (res.status) {
        router.reload(window.location.pathname);
      } else {
        if (res.data.status === 401) {
          useMyBackdropStore.setState((state) => {
            state.message = t("something_wrong_login");
            state.type = "dark";
            state.transparency = false;
          });
          setTimeout(() => {
            router.reload(window.location.pathname);
          }, 4000);
        }
      }
    });
  };

  useEffect(() => {
    setName(user.user.name);
    if (user.user.avatar_url) {
      setImgUrl(user.user.avatar_url);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Box sx={{ flexGrow: matchesSm ? 1 : 0, display: { md: "flex" } }}>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            {matchesSm ? (
              <></>
            ) : (
              <Box
                sx={{
                  ml: "19em",
                  width: "11rem",
                  flexGrow: 1,
                  display: { md: "flex" },
                }}
              >
                <Typography
                  noWrap
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1 }}
                >
                  {title}
                </Typography>
              </Box>
            )}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title={t("click_to_show_menu")}>
                {loading ? (
                  <Skeleton
                    sx={{ width: "200px" }}
                    animation="wave"
                    variant="text"
                  />
                ) : (
                  <Chip
                    sx={{ fontSize: "0.9rem", height: "35px" }}
                    avatar={<MyAvatar />}
                    label={name}
                    variant="filled"
                    onClick={handleMenu}
                    color="primary"
                  />
                )}
              </Tooltip>
              <Menu
                sx={{ mt: "45px", width: 200 }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseMenu}
                PaperProps={{
                  style: {
                    width: 200,
                  },
                }}
              >
                <MenuItem
                  onClick={() =>
                    myDialog(
                      true,
                      "confirm",
                      t("logout"),
                      t("are_you_sure"),
                      "xs",
                      logoutHandler,
                      t("button.yes"),
                      () => {
                        useMyDialogStore.setState((state) =>
                          state.handleClose()
                        );
                        handleCloseMenu();
                      },
                      t("button.no")
                    )
                  }
                >
                  <Typography textAlign="center">{t("logout")}</Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <MyBackdrop />
      <MyDialog />
    </>
  );
}
