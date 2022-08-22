import React, { useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import create from "zustand";
import { useTranslation } from "next-i18next";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { myAlert, errorHandling } from "../reusable/MyAlert";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";

import { useRouter } from "next/router";

import { configService } from "../../services/configService";
import { userService } from "../../services/userService";

import TranslateIcon from "@mui/icons-material/Translate";
import SaveIcon from "@mui/icons-material/Save";

const useConfigurationPageStore = create((set) => ({
  lang: "en",
  setLang: (newLang) => set({ lang: newLang }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export const ConfigurationPage = (props) => {
  const { t } = useTranslation();
  const { configs } = props;
  const theme = useTheme();
  const router = useRouter();
  const matchesMd = useMediaQuery(theme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { lang, setLang, isLoading, setIsLoading } =
    useConfigurationPageStore();

  const handleChange = (event) => {
    setLang(event.target.value);
  };

  const resetConfig = () => {
    if (configs) {
      setLang(configs.find((a) => a.name === "app.language").value);
    }
  };

  const updateConfig = () => {
    setIsLoading(true);
    const param = {
      configs: {
        "app.language": lang,
      },
    };

    configService.update(param).then((res) => {
      setIsLoading(false);
      if (!res.status) {
        errorHandling(
          res.data,
          t("error.error", { ns: "common" }),
          t(`error.${res.data.status}`, { ns: "common" })
        );
        resetConfig();
      } else {
        if (localStorage.getItem("configs") !== null) {
          localStorage.removeItem("configs");
        }
        router.push(router.route, router.asPath, { locale: lang });
      }
    });
  };

  useEffect(() => {
    resetConfig();
  }, []);

  return (
    <>
      <Grid
        container
        direction="row"
        spacing={2}
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: "1em" }}
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ mb: matchesMd ? "1em" : undefined }}
        >
          <Typography variant="h5" gutterBottom>
            {t("language", { ns: "configs" })}
          </Typography>
          <Typography variant="body2">
            {t("language_desc", { ns: "configs" })}
          </Typography>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          sx={{ display: "flex", flexDirection: "row-reverse" }}
        >
          <FormControl fullWidth>
            <InputLabel id="select-language">
              {t("language", { ns: "configs" })}
            </InputLabel>
            <Select
              labelId="select-language"
              value={lang}
              label={t("language", { ns: "configs" })}
              onChange={handleChange}
            >
              <MenuItem value="en">
                <ListItem dense component="div">
                  <ListItemAvatar>
                    <Avatar>
                      <TranslateIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={t("english_main", { ns: "configs" })}
                    secondary={t("english_sec", { ns: "configs" })}
                  />
                </ListItem>
              </MenuItem>
              <MenuItem value="id">
                <ListItem dense component="div">
                  <ListItemAvatar>
                    <Avatar>
                      <TranslateIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={t("indo_main", { ns: "configs" })}
                    secondary={t("indo_sec", { ns: "configs" })}
                  />
                </ListItem>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Divider />

      <Box
        sx={{
          display: "flex",
          position: "static",
          flexDirection: "row",
          justifyContent: "flex-end",
          mt: "2em",
        }}
      >
        <Button
          onClick={resetConfig}
          variant="outlined"
          size="large"
          sx={{ mr: "1em" }}
        >
          {t("button.reset")}
        </Button>
        {isLoading ? (
          <LoadingButton
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="contained"
            size="large"
          >
            {t("button.save")}
          </LoadingButton>
        ) : (
          <Button
            disabled={isLoading}
            startIcon={<SaveIcon />}
            onClick={updateConfig}
            variant="contained"
            size="large"
          >
            {t("button.save")}
          </Button>
        )}
      </Box>
    </>
  );
};
