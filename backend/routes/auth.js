import express from "express";

import * as authController from "../controllers/authController.js";
import { uploadAvatarMiddleware } from "../middleware/uploadAvatar.js";

const router = express.Router();

router.post("/login", authController.login);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/profile", authController.getProfile);
router.patch("/profile", authController.patchProfile);

router.post(
  "/profile/avatar",
  (req, res, next) => {
    uploadAvatarMiddleware.single("avatar")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Upload failed",
        });
      }
      next();
    });
  },
  authController.uploadProfileAvatar,
);

export default router;
