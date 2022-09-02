import React, { useEffect, useContext } from "react";
import { useTranslation } from "next-i18next";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Tooltip from "@mui/material/Tooltip";
import {
  useUpdateUserInfoDialogStore,
  UpdateUserInfoDialog,
} from "../dialog/UpdateUserInfoDialog";
import { myDialog, useMyDialogStore, MyDialog } from "../reusable/MyDialog";
import { myAlert, errorHandling } from "../reusable/MyAlert";
import { userService } from "../../services/userService";
import { useMyAvatarStore } from "../reusable/MyAvatar";
import { ActivityLogTable } from "../fragment/ActivityLogTable";
import { UserContext } from "../context/UserContext";

import LocalPoliceIcon from "@mui/icons-material/LocalPolice";
import EditIcon from "@mui/icons-material/Edit";

export const HomePage = (props) => {
  const { user, setUser } = useContext(UserContext);
  const { t } = useTranslation();
  const { name, imgUrl, setName, setImgUrl } = useMyAvatarStore();
  const { dName, setDName, dImg, setDImg, dPreviewUrl, setDPreviewUrl } =
    useUpdateUserInfoDialogStore();
  const theme = useTheme();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { setOpen, setLoading } = useMyDialogStore();
  const { handleClose } = useMyDialogStore();
  const closeDialog = () => {
    setDName("");
    setDImg(null);
    setDPreviewUrl(null);
    handleClose();
  };

  const stringToColor = (string = "No Name") => {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
  };

  const getInitial = (name = "No Name") => {
    const rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

    let initials = [...name.matchAll(rgx)] || [];

    return (initials = (
      (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
    ).toUpperCase());
  };

  const stringAvatar = (name) => {
    return {
      sx: {
        bgcolor: stringToColor(name),
        fontSize: matchesMd ? "2.95rem" : "4.95rem",
        width: matchesMd ? "150px" : "250px",
        height: matchesMd ? "150px" : "250px",
      },
      children: getInitial(name),
    };
  };

  const MyAvatar = (name) => {
    return <Avatar {...stringAvatar(name)} />;
  };

  const updateMyInfo = () => {
    setLoading(true);
    const param = {
      id: user.user.id,
      name: useUpdateUserInfoDialogStore.getState().dName,
      img: useUpdateUserInfoDialogStore.getState().dImg,
    };
    const formData = new FormData();
    for (var key in param) {
      formData.append(key, param[key]);
    }
    userService.updateInfo(formData).then((res) => {
      setLoading(false);
      if (!res.status) {
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
      } else {
        myAlert(
          true,
          t("success"),
          t("updated_info", { ns: "home" }),
          "success",
          "bottom",
          "right"
        );
        setOpen(false);
        setName(res.data.user.name);
        if (res.data.user.avatar_url) {
          setImgUrl(res.data.user.avatar_url);
        }
      }
    });
  };

  useEffect(() => {
    setName(user.user.name);
    setImgUrl(user.user.avatar_url);
  }, []);

  return (
    <Grid container direction={matchesMd ? "column" : "row"} spacing={4}>
      <Grid container item direction="row" xs={12} sm={4} md={4} rowSpacing={1}>
        <Grid item xs={12} sm={12} md={12} container justifyContent="center">
          {imgUrl ? (
            <Avatar
              sx={{
                width: matchesMd ? "150px" : "250px",
                height: matchesMd ? "150px" : "250px",
              }}
              src={`${process.env.NEXT_PUBLIC_BE_HOST}/${imgUrl}`}
              alt={name}
            />
          ) : (
            MyAvatar(name)
          )}
        </Grid>
        <Grid
          item
          container
          xs={12}
          sm={12}
          md={12}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h4">{name}</Typography>
          </Grid>
          <Grid item>
            <Tooltip title={t("button.info", { ns: "home" })}>
              <IconButton
                size="large"
                sx={{ ml: ".25em" }}
                onClick={() => {
                  myDialog(
                    true,
                    "form",
                    t("button.info", { ns: "home" }),
                    <UpdateUserInfoDialog name={name} />,
                    "sm",
                    updateMyInfo,
                    t("button.update"),
                    closeDialog,
                    t("button.cancel")
                  );
                  if (imgUrl) {
                    setDPreviewUrl(
                      `${process.env.NEXT_PUBLIC_BE_HOST}/${imgUrl}`
                    );
                  }
                }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={12} container justifyContent="center">
          {user.roles.map((role) => {
            return (
              <Chip
                key={role.id}
                icon={<LocalPoliceIcon />}
                sx={{ mr: ".5em", mb: ".5em" }}
                label={role.name}
                variant="outlined"
              />
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={12} sm={8} md={8}>
        <Typography gutterBottom variant="h5">
          {t("last_user_activity", { ns: "home" })}
        </Typography>
        <ActivityLogTable />
      </Grid>
      <MyDialog />
    </Grid>
  );
};
