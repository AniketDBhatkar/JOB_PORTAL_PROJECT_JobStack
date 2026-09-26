import axios from "axios";

// withCredentials: true is required because the backend sets an httpOnly
// "token" cookie on login (see user.controller.js -> login) and reads it
// back in isAuthenticate.js. Without this, the cookie is never sent/stored
// and every protected route will 401.
const api = axios.create({
  withCredentials: true,
});

export default api;
