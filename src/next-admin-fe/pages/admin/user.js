import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../components/layout/AdminLayout";
import { UserPage } from "../../components/page/UserPage";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import {
  MyBackdrop,
  myBackdrop,
  useMyBackdropStore,
} from "../../components/reusable/MyBackdrop";

export default function User(props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myBackdrop(
      loading,
      t("please_wait"),
      "h4",
      "light",
      true,
      null,
      null,
      0,
      0
    );
    const lang = props.configs.find((a) => a.name === "app.language").value;
    router.push(router.route, router.asPath, { locale: lang });
    useMyBackdropStore.setState((state) => (state.open = false));
    setLoading(false);
  }, []);

  if (!loading) {
    const title = `${t("administration")} - ${t("user")}`;
    return (
      <AdminLayout
        name="user"
        title={title}
        content={<UserPage />}
        user={props.user}
      />
    );
  } else {
    return <MyBackdrop />;
  }
}

export async function getServerSideProps(ctx) {
  const cookie = ctx.req.headers.cookie ? ctx.req.headers.cookie : null;
  const arrPromise = [];
  const configs = await fetch(`${process.env.NEXT_PUBLIC_BE_HOST}/api/configs`);
  const resConfigs = await configs.json();
  arrPromise.push(resConfigs);
  if (cookie) {
    const opts = {
      headers: {
        cookie: cookie,
      },
    };
    const user = await fetch(`${process.env.NEXT_PUBLIC_BE_HOST}/api/me`, opts);
    const resUser = await user.json();
    arrPromise.push(resUser);
  }

  const responses = await Promise.all(arrPromise);
  return {
    props: {
      configs: responses[0].data,
      user: responses[1] ? responses[1] : null,
      ...(await serverSideTranslations(ctx.locale, ["common", "user", "grid"])),
    },
  };
}
