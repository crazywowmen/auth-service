import { Router } from "express";
import {
  signupUser,
  signinUser,
  testProtected,
  testUnProtected,
} from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router: Router = Router();

router.post("/signup", signupUser);
router.post("/signin", signinUser);
router.get("/test-unprotected", testUnProtected);
router.get("/test-protected", authMiddleware, testProtected);

export default router;
