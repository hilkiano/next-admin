import axios from "axios";

export const privilegeService = {
  privilegeList,
  addPrivilege,
  updatePrivilege,
  deletePrivilege,
  restorePrivilege,
};

async function privilegeList(param) {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/list`, {
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

async function addPrivilege(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/add`, param, {
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

async function updatePrivilege(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/update`, param, {
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

async function deletePrivilege(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/delete`, param, {
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

async function restorePrivilege(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/restore`, param, {
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
