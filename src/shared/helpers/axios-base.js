import axios from "axios";

function getToken() {
  const token = localStorage.getItem("token");
  return token;
}

const instance = axios.create({
  baseURL: "http://localhost:5000/api/",
  // baseURL: "http://167.71.190.226/api/",
  headers: {
    "Content-Type": "application/json"
    // Authorization: getToken()
  }
});

instance.interceptors.request.use(
  config => {
    if (!config.headers.token) {
      const token = getToken();

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  error => Promise.reject(error)
);

export default instance;
