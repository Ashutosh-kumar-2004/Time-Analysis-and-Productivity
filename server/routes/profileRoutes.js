import e from "express";
import { getProfileInfo, updatePersonalDetails } from "../controllers/profileControllers.js";

const router = e.Router();

router.get("/details", getProfileInfo);
router.put("/update-profile-data-personal-details",updatePersonalDetails);

export default router;
