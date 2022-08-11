import axios from 'axios';

export const groupService = {
  groupList,
  dropdownList,
  addGroup,
  updateGroup,
  deleteGroup,
  restoreGroup
};

async function groupList(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/list`, { params: param })
    .then((res) => {
      return {
        "status": true,
        "data": res.data
      };
    })
    .catch((err) => {
      return {
        "status": false,
        "data": err.response
      };
    });
}

async function dropdownList() {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/dropdown_list`)
    .then((res) => {
      return {
        "status": true,
        "data": res.data
      };
    })
    .catch((err) => {
      return {
        "status": false,
        "data": err.response
      };
    });
}

async function addGroup(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/add`, param)
    .then((res) => {
      return {
        "status": true,
        "data": res.data
      };
    })
    .catch((err) => {
      return {
        "status": false,
        "data": err.response
      };
    });
}

async function updateGroup(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/update`, param)
    .then((res) => {
      return {
        "status": true,
        "data": res.data
      };
    })
    .catch((err) => {
      return {
        "status": false,
        "data": err.response
      };
    });
}

async function deleteGroup(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/delete`, param)
    .then((res) => {
      return {
        "status": true,
        "data": res.data
      };
    })
    .catch((err) => {
      return {
        "status": false,
        "data": err.response
      };
    });
}

async function restoreGroup(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/group/restore`, param)
    .then((res) => {
      return {
        "status": true,
        "data": res.data
      };
    })
    .catch((err) => {
      return {
        "status": false,
        "data": err.response
      };
    });
}