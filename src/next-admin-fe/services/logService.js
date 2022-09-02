import axios from "axios";

export const logService = {
  list,
};

async function list(param) {
  return await axios
    .get(`${process.env.NEXT_PUBLIC_BE_HOST}/api/log/list`, {
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
