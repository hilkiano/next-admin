import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import create from "zustand";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import {
  useUpdateUserInfoDialogStore,
  UpdateUserInfoDialog,
} from "../dialog/UpdateUserInfoDialog";
import { myDialog, useMyDialogStore, MyDialog } from "../reusable/MyDialog";
import { myAlert, errorHandling } from "../reusable/MyAlert";
import { userService } from "../../services/userService";
import { useAuthStore } from "../store/AuthStore";
import { useMyAvatarStore } from "../reusable/MyAvatar";

import EditIcon from "@mui/icons-material/Edit";

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
      fontSize: "4.95rem",
      width: "250px",
      height: "250px",
    },
    children: getInitial(name),
  };
};

const MyAvatar = (name) => {
  return <Avatar {...stringAvatar(name)} />;
};

export const HomePage = (props) => {
  const { t } = useTranslation(["common", "home"]);
  const { user } = props;
  const { name, imgUrl, setName, setImgUrl } = useMyAvatarStore();
  const { dName, setDName, dImg, setDImg, dPreviewUrl, setDPreviewUrl} = useUpdateUserInfoDialogStore();
  const { setOpen, setLoading } = useMyDialogStore();
  const { handleClose } = useMyDialogStore();
  const closeDialog = () => {
    setDName("");
    setDImg(null);
    setDPreviewUrl(null);
    handleClose();
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
      setLoading(false)
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
    <Grid container direction="row" spacing={2}>
      <Grid
        item
        direction="column"
        rowSpacing={2}
        container
        xs={12}
        sm={4}
        md={4}
        alignItems="center"
      >
        <Grid item>
          {imgUrl ? (
            <Avatar
              sx={{
                left: "5px",
                width: "250px",
                height: "250px",
              }}
              src={`${process.env.NEXT_PUBLIC_BE_HOST}/${imgUrl}`}
              alt={name}
            />
          ) : (
            MyAvatar(name)
          )}
        </Grid>
        <Grid item>
          <Typography variant="h4">{name}</Typography>
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            size="small"
            startIcon={<EditIcon />}
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
                setDPreviewUrl(`${process.env.NEXT_PUBLIC_BE_HOST}/${imgUrl}`);
              }
            }}
          >
            {t("button.info", { ns: "home" })}
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={8} md={8}>
        <Typography variant="h2">activity log table</Typography>
      </Grid>
      <MyDialog />
    </Grid>
  );
};
