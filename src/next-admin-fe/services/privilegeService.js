import axios from 'axios';

export const privilegeService = {
  privilegeList,
  addPrivilege,
  updatePrivilege,
  deletePrivilege,
  restorePrivilege
};

async function privilegeList(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/list`, { params: param })
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

async function addPrivilege(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/add`, param)
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

async function updatePrivilege(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/update`, param)
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

async function deletePrivilege(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/delete`, param)
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

async function restorePrivilege(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/privilege/restore`, param)
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