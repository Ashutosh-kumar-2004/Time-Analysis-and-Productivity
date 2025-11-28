import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload profile picture
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "profile_pics",
      width: 300,
      height: 300,
      crop: "thumb",
      gravity: "face",
    });

    fs.unlinkSync(req.file.path); // remove temp file

    // Return URL to frontend
    res.json({ url: result.secure_url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
