import React from "react";
import { appWithTranslation } from "next-i18next";
import PropTypes from "prop-types";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import createEmotionCache from "../utility/createEmotionCache";
import lightTheme from "../styles/theme/lightTheme";
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

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
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
