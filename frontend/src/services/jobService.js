import api from "./api";
import { JOB_API_END_POINT } from "../utils/constant";

// POST /api/v1/job/post
// { title, description, requirements, salary, location, jobType, experience, position, companyId }
export const postJob = (data) => api.post(`${JOB_API_END_POINT}/post`, data);

// GET /api/v1/job/get?keyword=
export const getAllJobs = (keyword = "") =>
  api.get(`${JOB_API_END_POINT}/get`, { params: { keyword } });

// GET /api/v1/job/getadminjobs
export const getAdminJobs = () => api.get(`${JOB_API_END_POINT}/getadminjobs`);

// GET /api/v1/job/get/:id
// NOTE: job.controller.js -> getJobById currently has two bugs that will
// crash the backend for this route:
//   1. `req.param.id` should be `req.params.id`
//   2. `res.status.json(...)` should be `res.status(200).json(...)`
// Fix those two lines server-side or this call will fail with a 500.
export const getJobById = (id) => api.get(`${JOB_API_END_POINT}/get/${id}`);
