import axios from "axios";
import { toast } from "react-toastify";

const myAxios = axios.create({
  baseURL: "http://localhost:4000",
  withCredentials: false,
});

myAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error.response ? error.response : null;
    console.error(response);
    toast.error("Server Error! Try again later!", { autoClose: 3000 });
    const err = new Error();
    throw Object.assign(err, response);
  }
);

export { myAxios };
