import axios from 'axios';

export const menuService = {
  menuList,
  addMenu,
  updateMenu,
  deleteMenu,
  restoreMenu
};

async function menuList(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/list`, { params: param })
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

async function addMenu(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/add`, param)
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

async function updateMenu(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/update`, param)
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

async function deleteMenu(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/delete`, param)
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

async function restoreMenu(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/menu/restore`, param)
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