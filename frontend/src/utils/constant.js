// This MUST match how your backend (index.js) mounts the routers:
//   app.use("/api/v1/user", userRoute)
//   app.use("/api/v1/company", companyRoute)
//   app.use("/api/v1/job", jobRoute)
//   app.use("/api/v1/application", applicationRoute)
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

export const USER_API_END_POINT = `${BASE_URL}/user`;
export const JOB_API_END_POINT = `${BASE_URL}/job`;
export const COMPANY_API_END_POINT = `${BASE_URL}/company`;
export const APPLICATION_API_END_POINT = `${BASE_URL}/application`;
