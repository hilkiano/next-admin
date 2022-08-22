import axios from "axios";

export const groupService = {
  groupList,
  dropdownList,
  addGroup,
  updateGroup,
  deleteGroup,
  restoreGroup,
};

async function groupList(param) {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/list`, {
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
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/dropdown_list`, {
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

async function addGroup(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/add`, param, {
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

async function updateGroup(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/update`, param, {
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

async function deleteGroup(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/delete`, param, {
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

async function restoreGroup(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/restore`, param, {
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
