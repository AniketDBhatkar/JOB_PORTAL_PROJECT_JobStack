import express from "express"
import isAuthenticated from "../middleware/isAuthenticate.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.controller.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(isAuthenticated, registerCompany);
router.route("/get").get(isAuthenticated, getCompany);
router.route("/get/:id").get(isAuthenticated, getCompanyById)
// FIX: added `singleUpload` so `req.file` (logo) is actually populated —
// previously the controller referenced req.file but no multer middleware
// was attached here, so it was always undefined.
router.route("/update/:id").put(isAuthenticated, singleUpload, updateCompany);

export default router;
