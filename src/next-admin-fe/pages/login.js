import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import LoginPage from "../components/page/LoginPage";
import {
  MyBackdrop,
  myBackdrop,
  useMyBackdropStore,
} from "../components/reusable/MyBackdrop";

export default function Index(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myBackdrop(loading, "Please wait", "h4", "light", true, null, null, 0, 0);
    if (localStorage.getItem("token")) {
      router.push("/");
    } else {
      setLoading(false);
      useMyBackdropStore.setState((state) => (state.open = false));
    }
  }, []);

  if (!loading) {
    return <LoginPage />;
  } else {
    return <MyBackdrop />;
  }
}
