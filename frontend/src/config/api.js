import axios from "axios";

// Public instance (no token)
export const apiPublic = axios.create({
  baseURL: "/bff", // Vite proxy handles this
});

// Private instance (adds token)
export const apiPrivate = axios.create({
  baseURL: "/bff",
});

apiPrivate.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// with this no need call the entire localhost thing
// only copy the url after bff/ for example localhost:8080/bff/auth/login :-> /auth/login only this will be enough
// apiPrivate is used to whena  token should be passed to the backend
// apiPublic is used when no token is needed to be passed to the backend
// for example login and signup no token is needed to be passed to the backend 
// as an example check authService.js file in the services folder
// and check the apiPublic instance used in the signup and login functions
// i will provide a exmaple for apiPrivate in that file
