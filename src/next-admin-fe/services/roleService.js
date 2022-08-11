import axios from 'axios';

export const roleService = {
  roleList,
  dropdownList,
  addRole,
  updateRole,
  deleteRole,
  restoreRole
};

async function roleList(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/list`, { params: param })
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
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/dropdown_list`)
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

async function addRole(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/add`, param)
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

async function updateRole(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/update`, param)
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

async function deleteRole(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/delete`, param)
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

async function restoreRole(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/role/restore`, param)
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