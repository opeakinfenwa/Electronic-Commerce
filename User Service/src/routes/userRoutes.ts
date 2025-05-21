import express from "express";
import {
  signupController,
  updateUserController,
  uploadProfilePicController,
  updateProfilePicController,
  deleteProfilePicController,
  getSingleUserController,
  getAllUsersController,
  deleteUserController,
} from "../controllers/userController";
import { isAuth, isAdmin } from "../middleware/authMiddleware";
import { singleUpload } from "../middleware/multerMiddleware";

const router = express.Router();

router.post("/signup", signupController);
router.put("/update-user", isAuth, updateUserController);
router.delete("/delete-profile/:id", isAuth, isAdmin, deleteUserController);
router.post("/upload-profilepic", isAuth, singleUpload, uploadProfilePicController);
router.put("/update-profilepic", isAuth, singleUpload, updateProfilePicController);
router.delete("/delete-profilepic", isAuth, deleteProfilePicController);
router.get("/get-user", isAuth, isAdmin, getSingleUserController);
router.get("/get-allusers", isAuth, isAdmin, getAllUsersController);

export default router;