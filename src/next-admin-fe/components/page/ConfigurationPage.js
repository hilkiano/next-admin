import React, { useEffect, useContext } from "react";
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
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { UserContext } from "../context/UserContext";

import { useRouter } from "next/router";

import { configService } from "../../services/configService";

import TranslateIcon from "@mui/icons-material/Translate";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SaveIcon from "@mui/icons-material/Save";

const useConfigurationPageStore = create((set) => ({
  lang: "en",
  setLang: (newLang) => set({ lang: newLang }),
  theme: "light",
  setTheme: (newTheme) => set({ theme: newTheme }),
  timezone: "Asia/Jakarta",
  setTimezone: (newTz) => set({ timezone: newTz }),
  timezoneList: [],
  setTimezoneList: (list) => set({ timezoneList: list }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
}));

export const ConfigurationPage = (props) => {
  const { user, setUser } = useContext(UserContext);
  // Privilege
  const canUpdateConfig = user.privileges.some(
    (a) => a.name === "ACT_UPDATE_DEFAULT_CONFIG"
  );
  // End of privilege
  const { t } = useTranslation();
  const { configs, tzList } = props;
  const muiTheme = useTheme();
  const router = useRouter();
  const matchesMd = useMediaQuery(muiTheme.breakpoints.down("md"));
  const matchesSm = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const {
    lang,
    setLang,
    theme,
    setTheme,
    timezone,
    setTimezone,
    timezoneList,
    setTimezoneList,
    isLoading,
    setIsLoading,
  } = useConfigurationPageStore();

  const handleLangChange = (event) => {
    setLang(event.target.value);
  };
  const handleThemeChange = (event) => {
    setTheme(event.target.value);
  };
  const handleTzChange = (event) => {
    setTimezone(event.target.value);
  };

  const resetConfig = () => {
    if (configs) {
      setLang(configs.find((a) => a.name === "app.language").value);
      setTheme(configs.find((a) => a.name === "app.theme").value);
      setTimezone(configs.find((a) => a.name === "app.tz").value);
    }
  };

  const updateConfig = () => {
    setIsLoading(true);
    const param = {
      configs: {
        "app.language": lang,
        "app.theme": theme,
        "app.tz": timezone,
      },
    };
    configService.update(param).then((res) => {
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
        router.reload();
      }
      setIsLoading(false);
    });
  };

  useEffect(() => {
    resetConfig();
    setTimezoneList(tzList);
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
              onChange={handleLangChange}
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
      <Divider sx={{ mb: "1em" }} />
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
            {t("theme", { ns: "configs" })}
          </Typography>
          <Typography variant="body2">
            {t("theme_desc", { ns: "configs" })}
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
            <InputLabel id="select-theme">
              {t("theme", { ns: "configs" })}
            </InputLabel>
            <Select
              labelId="select-theme"
              value={theme}
              label={t("theme", { ns: "configs" })}
              onChange={handleThemeChange}
            >
              <MenuItem value="light">
                <ListItem dense component="div">
                  <ListItemAvatar>
                    <Avatar>
                      <LightModeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={t("light", { ns: "configs" })} />
                </ListItem>
              </MenuItem>
              <MenuItem value="dark">
                <ListItem dense component="div">
                  <ListItemAvatar>
                    <Avatar>
                      <DarkModeIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary={t("dark", { ns: "configs" })} />
                </ListItem>
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Divider sx={{ mb: "1em" }} />
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
            {t("timezone", { ns: "configs" })}
          </Typography>
          <Typography variant="body2">
            {t("timezone_desc", { ns: "configs" })}
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
            <Autocomplete
              clearText={t("clear")}
              closeText={t("close")}
              openText={t("open")}
              noOptionsText={t("no_options")}
              value={timezone}
              id="select-timezone"
              options={timezoneList}
              getOptionLabel={(option) => option}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("timezone", { ns: "configs" })}
                  placeholder={t("type_something")}
                  InputProps={{
                    ...params.InputProps,
                  }}
                />
              )}
              onChange={(e, v) => setTimezone(v)}
              isOptionEqualToValue={(o, v) => o === v}
              disableClearable
            />
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
          disabled={!canUpdateConfig}
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
            disabled={isLoading || !canUpdateConfig}
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
