import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import LoginPage from "../components/page/LoginPage";
import {
  MyBackdrop,
  myBackdrop,
  useMyBackdropStore,
} from "../components/reusable/MyBackdrop";

export default function Index(props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myBackdrop(
      loading,
      t("please_wait", { ns: "common" }),
      "h4",
      "light",
      true,
      null,
      null,
      0,
      0
    );
    localStorage.setItem("configs", JSON.stringify(props.configs));
    const lang = JSON.parse(localStorage.getItem("configs")).find(
      (conf) => conf.name === "app.language"
    ).value;
    router.push(router.route, router.asPath, { locale: lang });
    setLoading(false);
    useMyBackdropStore.setState((state) => (state.open = false));
  }, []);

  if (!loading) {
    return <LoginPage />;
  } else {
    return <MyBackdrop />;
  }
}

export async function getStaticProps({ locale }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BE_HOST}/api/configs`);
  const data = await res.json();

  return {
    props: {
      configs: data.data,
      ...(await serverSideTranslations(locale, ["common", "login"])),
    },
  };
}
