import React from "react";
import { appWithTranslation } from "next-i18next";
import PropTypes from "prop-types";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { UserContext } from "../components/context/UserContext";

import createEmotionCache from "../utility/createEmotionCache";
import lightTheme from "../styles/theme/lightTheme";
import darkTheme from "../styles/theme/darkTheme";
import "../styles/globals.css";

const clientSideEmotionCache = createEmotionCache();
Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());

const MyApp = (props) => {
  const {
    Component,
    emotionCache = clientSideEmotionCache,
    pageProps,
    router,
  } = props;
  const pageAnimation = {
    pageInitial: {
      opacity: 0,
      duration: 1,
    },
    pageAnimate: {
      opacity: 1,
    },
    pageExit: {
      opacity: 0,
    },
  };
  const [user, setUser] = React.useState(null);
  const providerUser = React.useMemo(
    () => ({ user, setUser }),
    [user, setUser]
  );
  const theme = pageProps.configs.find((a) => a.name === "app.theme").value;

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme === "light" ? lightTheme : darkTheme}>
        <CssBaseline />
        <UserContext.Provider value={providerUser}>
          <AnimatePresence exitBeforeEnter>
            <motion.div
              key={router.route}
              initial="pageInitial"
              animate="pageAnimate"
              exit="pageExit"
              transition={{
                duration: 0.2,
              }}
              variants={pageAnimation}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </UserContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default appWithTranslation(MyApp);

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
