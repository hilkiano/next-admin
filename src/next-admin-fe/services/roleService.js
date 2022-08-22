import axios from "axios";

export const roleService = {
  roleList,
  dropdownList,
  addRole,
  updateRole,
  deleteRole,
  restoreRole,
};

async function roleList(param) {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/list`, {
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

async function dropdownList() {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/dropdown_list`, {
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

async function addRole(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/add`, param, {
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

async function updateRole(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/update`, param, {
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

async function deleteRole(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/delete`, param, {
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

async function restoreRole(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/restore`, param, {
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
