import { Router } from "express";
import {
  getCurrentAccount,
  login,
  logout,
  register,
} from "../controllers/auth.controller";
import {
  loginValidation,
  registerValidation,
} from "../helpers/validations/auth.validations";
import { validateJWT } from "../middlewares";

const router = Router();

router.post("/signup", [...registerValidation], register);

router.post("/signin", [...loginValidation], login);

router.get("/currentAccount", validateJWT, getCurrentAccount);

router.post("/signout", logout);

export default router;
