import React, { useContext } from "react";
import { useRouter } from "next/router";
import Clock from "react-live-clock";
import { UserContext } from "../context/UserContext";
import "moment/locale/id";

export const AppInfo = () => {
  const { user, setUser } = useContext(UserContext);
  const router = useRouter();
  const tz = user.configs.find((a) => a.name === "app.tz").value;
  const locale = router.locale;

  return (
    <Clock
      format={"DD MMMM YYYY, HH:mm:ss"}
      locale={locale}
      ticking={true}
      timezone={tz}
      noSsr
    />
  );
};
