import express from "express"
import { updateProfile, register, login, logout } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticate.js";
import { singleUpload } from "../middleware/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout)
// FIX: added `singleUpload` so `req.file` (resume) is actually populated —
// previously the controller referenced req.file but no multer middleware
// was attached here, so it was always undefined.
router.route("/profile/update").post(isAuthenticated, singleUpload, updateProfile);

export default router;
