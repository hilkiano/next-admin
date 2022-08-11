import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

import AdminLayout from "../../components/layout/AdminLayout";
import { UserPage } from "../../components/page/UserPage";
import {
  MyBackdrop,
  myBackdrop,
  useMyBackdropStore,
} from "../../components/reusable/MyBackdrop";

export default function User(props) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myBackdrop(loading, "Please wait", "h4", "light", true, null, null, 0, 0);
    if (!localStorage.getItem("token")) {
      router.push("/login");
    } else {
      setLoading(false);
      useMyBackdropStore.setState((state) => (state.open = false));
    }
  }, []);

  if (!loading) {
    return (
      <AdminLayout
        name="user"
        title="Administrator - User"
        content={<UserPage />}
      />
    );
  } else {
    return <MyBackdrop />;
  }
}
