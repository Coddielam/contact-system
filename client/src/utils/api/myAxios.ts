import axios from "axios";

const myAxios = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: false,
});

myAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response ? error.response : null;
    console.error(response);
    const err = new Error();
    throw Object.assign(err, response);
  }
);

export { myAxios };
