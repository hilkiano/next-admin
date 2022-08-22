import axios from "axios";

export const configService = {
  update,
};

async function update(param) {
  return await axios
    .post(`${process.env.NEXT_PUBLIC_BE_HOST}/api/configs/update`, param, {
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
