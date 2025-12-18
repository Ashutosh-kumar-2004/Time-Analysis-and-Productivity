import e from "express";
import { login, signup, googleLogin } from "../controllers/Register.js";

const router = e.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin);

export default router;
