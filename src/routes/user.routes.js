import { Router } from "express";
import {
  changePassword,
  loginUser,
  logoutUser,
  refreshAcessToken,
  userRegister,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { varifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegister
);
router.route("/login").post(loginUser);
router.route("/logout").post(varifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAcessToken);
router.route("/password-change").post(varifyJWT, changePassword);

export default router;
// router.route("/register").post(upload.single("avatar"), userRegister)