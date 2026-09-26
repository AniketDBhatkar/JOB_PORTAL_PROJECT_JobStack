import api from "./api";
import { APPLICATION_API_END_POINT } from "../utils/constant";

// GET /api/v1/application/apply/:id
// (Defined as GET in application.router.js, not POST — kept as-is to match.)
export const applyToJob = (jobId) => api.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`);

// GET /api/v1/application/get  -> jobs the current user has applied to
export const getAppliedJobs = () => api.get(`${APPLICATION_API_END_POINT}/get`);

// PUT /api/v1/application/:id/applicants  -> :id is the JOB id
// (Defined as PUT in application.router.js even though it only reads data — kept as-is to match.)
export const getApplicants = (jobId) =>
  api.put(`${APPLICATION_API_END_POINT}/${jobId}/applicants`);

// PUT /api/v1/application/status/:id/update  -> :id is the APPLICATION id
// body: { status: "accepted" | "rejected" | "pending" }
export const updateApplicationStatus = (applicationId, status) =>
  api.put(`${APPLICATION_API_END_POINT}/status/${applicationId}/update`, { status });
