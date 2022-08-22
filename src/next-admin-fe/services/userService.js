import axios from "axios";

export const userService = {
  login,
  logout,
  me,
  userList,
  updateUser,
  addUser,
  deleteUser,
  restoreUser,
  updateInfo,
};

async function login(username, password) {
  return await axios
    .post(
      `${process.env.NEXT_PUBLIC_BE_HOST}/api/login`,
      {
        username: username,
        password: password,
      },
      {
        withCredentials: true,
      }
    )
    .then((res) => {
      return {
        status: true,
        data: res,
      };
    })
    .catch((err) => {
      return {
        status: false,
        data: err.response,
      };
    });
}

async function logout() {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/logout`, null, {
      withCredentials: true,
    })
    .then((res) => {
      return {
        status: true,
        data: res,
      };
    })
    .catch((err) => {
      return {
        status: false,
        data: err.response,
      };
    });
}

async function me() {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/me`, null, {
      withCredentials: true,
    })
    .then((res) => {
      return {
        status: true,
        data: res,
      };
    })
    .catch((err) => {
      return {
        status: false,
        data: err.response,
      };
    });
}

async function userList(param) {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/list`, {
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

async function updateUser(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/update`, param, {
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

async function addUser(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/add`, param, {
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

async function deleteUser(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/delete`, param, {
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

async function restoreUser(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/restore`, param, {
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

async function updateInfo(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/updateInfo`, param, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
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
