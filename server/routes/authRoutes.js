import e from "express";
import { login, signup } from "../controllers/Register.js";

const router = e.Router();

router.post("/signup", signup);
router.post("/login", login);

export default router;
