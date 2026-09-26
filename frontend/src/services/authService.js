import api from "./api";
import { USER_API_END_POINT } from "../utils/constant";

// POST /api/v1/user/register  { fullName, email, phoneNumber, password, role }
export const registerUser = (data) => api.post(`${USER_API_END_POINT}/register`, data);

// POST /api/v1/user/login  { email, password, role }
export const loginUser = (data) => api.post(`${USER_API_END_POINT}/login`, data);

// GET /api/v1/user/logout
export const logoutUser = () => api.get(`${USER_API_END_POINT}/logout`);

// POST /api/v1/user/profile/update  { fullName, email, phoneNumber, bio, skills }
// NOTE: user.router.js does not attach a multer middleware to this route,
// so file fields (resume / profile photo) referenced in the controller are
// not actually receivable yet. This sends JSON only. If you want file
// uploads, add multer (and storage of your choice) to that route first.
export const updateProfile = (data) => api.post(`${USER_API_END_POINT}/profile/update`, data);
