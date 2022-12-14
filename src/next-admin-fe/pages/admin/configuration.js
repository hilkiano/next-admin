import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import AdminLayout from "../../components/layout/AdminLayout";
import { ConfigurationPage } from "../../components/page/ConfigurationPage";
import { UserContext } from "../../components/context/UserContext";

import {
  MyBackdrop,
  myBackdrop,
  useMyBackdropStore,
} from "../../components/reusable/MyBackdrop";

export default function Configuration(props) {
  const { t } = useTranslation();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useContext(UserContext);

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
    const lang = props.configs.find((a) => a.name === "app.language").value;
    router.push(router.route, router.asPath, { locale: lang });
    useMyBackdropStore.setState((state) => (state.open = false));
    setUser(props.user);
    setLoading(false);
  }, []);

  if (!loading) {
    const title = `${t("administration")} - ${t("configuration")}`;
    return (
      <AdminLayout
        name="configuration"
        title={title}
        content={
          <ConfigurationPage configs={props.configs} tzList={props.tzList} />
        }
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
    const tzList = await fetch(
      `${process.env.NEXT_PUBLIC_BE_HOST}/api/timezone/list`,
      opts
    );
    const resTzList = await tzList.json();
    arrPromise.push(resTzList);
  }

  const responses = await Promise.all(arrPromise);
  return {
    props: {
      configs: responses[0].data,
      user: responses[1] ? responses[1] : null,
      tzList: responses[2] && responses[2].success ? responses[2].data : null,
      ...(await serverSideTranslations(ctx.locale, ["common", "configs"])),
    },
  };
}
