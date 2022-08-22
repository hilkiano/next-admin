import axios from "axios";

export const menuService = {
  menuList,
  addMenu,
  updateMenu,
  deleteMenu,
  restoreMenu,
};

async function menuList(param) {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/list`, {
      params: param,
      withCredentials: true,
    })
    .then((res) => {
      return {
        status: true,
        data: res.data,
      };
    })
    .catch((err) => {
      return {
        status: false,
        data: err.response,
      };
    });
}

async function addMenu(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/add`, param, {
      withCredentials: true,
    })
    .then((res) => {
      return {
        status: true,
        data: res.data,
      };
    })
    .catch((err) => {
      return {
        status: false,
        data: err.response,
      };
    });
}

async function updateMenu(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/update`, param, {
      withCredentials: true,
    })
    .then((res) => {
      return {
        status: true,
        data: res.data,
      };
    })
    .catch((err) => {
      return {
        status: false,
        data: err.response,
      };
    });
}

async function deleteMenu(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/delete`, param, {
      withCredentials: true,
    })
    .then((res) => {
      return {
        status: true,
        data: res.data,
      };
    })
    .catch((err) => {
      return {
        status: false,
        data: err.response,
      };
    });
}

async function restoreMenu(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/restore`, param, {
      withCredentials: true,
    })
    .then((res) => {
      return {
        status: true,
        data: res.data,
      };
    })
    .catch((err) => {
      return {
        status: false,
        data: err.response,
      };
    });
}
