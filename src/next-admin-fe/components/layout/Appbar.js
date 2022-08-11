import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

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

export default function Appbar({ title, handleDrawerToggle }) {
  const router = useRouter();
  const theme = useTheme();
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const setName = useMyAvatarStore((state) => state.setName);
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
    myBackdrop(true, "Logging out", "h5", "dark", true, 30, true);
    userService.logout().then((res) => {
      if (res.status) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.reload(window.location.pathname);
      } else {
        if (res.data.status === 401) {
          useMyBackdropStore.setState((state) => {
            state.message =
              "Something wrong happened. Redirecting to login page.";
            state.type = "dark";
            state.transparency = false;
          });
          setTimeout(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.reload(window.location.pathname);
          }, 4000);
        }
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    userService.me().then((res) => {
      if (!res.status) {
        if (!res.data) {
          useMyBackdropStore.setState((state) => {
            state.open = true;
            state.textVariant = "h5";
            state.message = "Please wait";
            state.type = "light";
            state.indicatorSize = 30;
            state.transparency = false;
          });
        } else {
          useMyBackdropStore.setState((state) => {
            state.open = true;
            state.textVariant = "h5";
            state.message =
              "Your session is expired. Redirecting to login page.";
            state.type = "dark";
            state.indicatorSize = 30;
            state.transparency = false;
          });
        }
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.reload(window.location.pathname);
        }, 4000);
      } else {
        setLoading(false);
        setUser(res.data.data.user);
        setName(res.data.data.user.name);
      }
    });
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar>
            <Box sx={{ flexGrow: 1, display: { md: "flex" } }}>
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
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Click to show menu">
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
                    label={user.name}
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
                      "Logout",
                      `Are you sure?`,
                      "xs",
                      logoutHandler,
                      "Yes",
                      () => {
                        useMyDialogStore.setState((state) =>
                          state.handleClose()
                        );
                      },
                      "No"
                    )
                  }
                >
                  <Typography textAlign="center">Logout</Typography>
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
