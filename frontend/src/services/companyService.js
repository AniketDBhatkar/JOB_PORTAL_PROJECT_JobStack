import api from "./api";
import { COMPANY_API_END_POINT } from "../utils/constant";

// POST /api/v1/company/register  { companyName }
export const registerCompany = (companyName) =>
  api.post(`${COMPANY_API_END_POINT}/register`, { companyName });

// GET /api/v1/company/get
export const getCompanies = () => api.get(`${COMPANY_API_END_POINT}/get`);

// GET /api/v1/company/get/:id
export const getCompanyById = (id) => api.get(`${COMPANY_API_END_POINT}/get/${id}`);

// PUT /api/v1/company/update/:id  { name, description, website, location }
// NOTE: company.router.js does not attach multer to this route either, so
// the `logo` file referenced in the controller is not actually receivable
// yet. This sends JSON only.
export const updateCompany = (id, data) => api.put(`${COMPANY_API_END_POINT}/update/${id}`, data);
