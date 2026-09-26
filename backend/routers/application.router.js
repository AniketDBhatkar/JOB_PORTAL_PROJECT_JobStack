import express from "express"
import isAuthenticated from "../middleware/isAuthenticate.js";
import { applyJob, getApliedJobs, getApplicants, updateStatus } from "../controllers/application.controller.js";


const router = express.Router();

// NOTE: /apply/:id is a GET and /:id/applicants is a PUT even though
// semantically they'd more commonly be POST/GET. Left as-is because the
// frontend (services/applicationService.js) already calls these exact
// verbs. If you want to make these RESTful, change both here and in the
// frontend service file together.
router.route("/apply/:id").get(isAuthenticated, applyJob);
router.route("/get").get(isAuthenticated, getApliedJobs);
router.route("/:id/applicants").put(isAuthenticated, getApplicants)
router.route("/status/:id/update").put(isAuthenticated, updateStatus);

export default router;
