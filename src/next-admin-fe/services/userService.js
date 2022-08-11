import axios from 'axios';

export const userService = {
  login,
  logout,
  me,
  userList,
  updateUser,
  addUser,
  deleteUser,
  restoreUser
};

async function login(username, password) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/login`, {
      username: username,
      password: password,
    })
    .then((res) => {
      return {
        "status": true,
        "data": res
      };
    })
    .catch((err) => {
      return {
        "status": false,
        "data": err.response
      };
    });
}

async function logout() {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/logout`)
    .then((res) => {
      return {
        "status": true,
        "data": res
      };
    })
    .catch((err) => {
      return {
        "status": false,
        "data": err.response
      };
    });
}

async function me() {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/me`)
    .then((res) => {
      return {
        "status": true,
        "data": res
      };
    })
    .catch((err) => {
      return {
        "status": false,
        "data": err.response
      };
    });
}

async function userList(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/list`, { params: param })
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

async function updateUser(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/update`, param)
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

async function addUser(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/add`, param)
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

async function deleteUser(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/delete`, param)
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

async function restoreUser(param) {
  const token = Buffer.from(localStorage.getItem('token'), 'base64').toString('utf8');
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/user/restore`, param)
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