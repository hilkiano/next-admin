import React from "react";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import NestedList from "./GenerateMenu";
import { useTranslation } from "next-i18next";

import Appbar from "./Appbar";

import { MyAlert } from "../reusable/MyAlert";

const drawerWidth = 300;

export default function AdminLayout(props) {
  const { t } = useTranslation(["common"]);
  const router = useRouter();
  const { window, name, title, content, user } = props;

  if (!user) {
    router.push("/login");
    return;
  }

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const menuList = user.menus;
  const message = t("please_wait");
  const drawer = (
    <div>
      <Toolbar />
      <Divider />
      <NestedList lists={menuList} activeLink={name} message={message} />
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;
  return (
    <>
      <Box sx={{ display: { md: "flex", sm: "flex" } }}>
        <CssBaseline />
        <Appbar
          title={title}
          handleDrawerToggle={handleDrawerToggle}
          user={user}
        />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
          aria-label="mailbox folders"
        >
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            mt: "4em",
          }}
        >
          <React.Fragment>{content}</React.Fragment>
        </Box>
      </Box>
      <MyAlert />
    </>
  );
}
