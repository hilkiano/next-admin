import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { RolePage } from "../../components/page/RolePage";
import AdminLayout from "../../components/layout/AdminLayout";

import {
  MyBackdrop,
  myBackdrop,
  useMyBackdropStore,
} from "../../components/reusable/MyBackdrop";

export default function Role(props) {
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
        name="role"
        title="Administrator - Role"
        content={<RolePage />}
      />
    );
  } else {
    return <MyBackdrop />;
  }
}
