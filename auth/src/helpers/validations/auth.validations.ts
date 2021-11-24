import { body } from "express-validator";
import { validateRequest } from "../../middlewares";

export const registerValidation = [
  body("firstName").notEmpty().withMessage("firstName is require"),
  body("lastName").notEmpty().withMessage("lastName is require"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage("Password must be between 4 and 20 characters"),
  validateRequest,
];

export const loginValidation = [
  body("usernameOrEmail", "The email or username is required").not().isEmpty(),
  body("password").notEmpty().trim().withMessage("You must suppy a password"),
  validateRequest,
];
