import * as React from "react";
import create from "zustand";
import Avatar from "@mui/material/Avatar";

export const useMyAvatarStore = create((set) => ({
  name: "",
  setName: (newName) => set({ name: newName }),
  imgUrl: null,
  setImgUrl: (newUrl) => set({ imgUrl: newUrl }),
}));

const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

const getInitial = (name) => {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, "gu");

  let initials = [...name.matchAll(rgx)] || [];

  return (initials = (
    (initials.shift()?.[1] || "") + (initials.pop()?.[1] || "")
  ).toUpperCase());
};

const stringAvatar = (name) => {
  return {
    sx: {
      bgcolor: stringToColor(name),
      left: "5px",
      fontSize: "0.75rem",
      width: "25px",
      height: "25px",
    },
    children: getInitial(name),
  };
};

const imgAvatar = (name, url) => {
  return {
    sx: {
      left: "5px",
      width: "25px",
      height: "25px",
    },
    src: `${process.env.NEXT_PUBLIC_BE_HOST}/${url}`,
    alt: name,
  };
};

export const MyAvatar = () => {
  const { name, imgUrl } = useMyAvatarStore();

  if (imgUrl) {
    return <Avatar {...imgAvatar(name, imgUrl)} />;
  } else {
    return <Avatar {...stringAvatar(name)} />;
  }
};
