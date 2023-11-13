import Joi from "joi";
import * as ibantools from "ibantools";

export const login = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
}).meta({ className: "LoginRequest" });

export const register = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
  passwordRepeated: Joi.ref("password"),
  firstName: Joi.string().trim().required(),
  lastName: Joi.string().trim().required(),
  zipCode: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  street: Joi.string().trim().required(),
  houseNumber: Joi.string().trim().required(),
  bank: Joi.string().trim().required(),
  iban: Joi.string()
    .custom((value, helpers) => {
      if (!ibantools.isValidIBAN(value)) {
        return helpers.error("Invalid IBAN");
      }

      return value;
    })
    .required(),
  bic: Joi.string()
    .custom((value, helpers) => {
      if (!ibantools.isValidBIC(value)) {
        return helpers.error("Invalid ´BIC");
      }

      return value;
    })
    .required(),
  taxNumber: Joi.string().trim(),
  vatId: Joi.string().trim(),
  telephone: Joi.string().trim().required(),
  email: Joi.string().trim().email().required(),
})
  .or("taxNumber", "vatId")
  .meta({ className: "RegisterRequest" });

export const editUser = Joi.object({
  username: Joi.string().trim().optional(),
  firstName: Joi.string().trim().optional(),
  lastName: Joi.string().trim().optional(),
  zipCode: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  street: Joi.string().trim().optional(),
  houseNumber: Joi.string().trim().optional(),
  bank: Joi.string().trim().optional(),
  iban: Joi.string()
    .custom((value, helpers) => {
      if (!ibantools.isValidIBAN(value)) {
        return helpers.error("Invalid IBAN");
      }

      return value;
    })
    .optional(),
  bic: Joi.string()
    .custom((value, helpers) => {
      if (!ibantools.isValidBIC(value)) {
        return helpers.error("Invalid BIC");
      }

      return value;
    })
    .optional(),
  taxNumber: Joi.string().trim().optional(),
  vatId: Joi.string().trim().optional(),
  telephone: Joi.string().trim().optional(),
  email: Joi.string().trim().email().optional(),
}).meta({ className: "EditUserRequest" });

export const changePassword = Joi.object({
  oldPassword: Joi.string().trim().required(),
  newPassword: Joi.string().trim().required(),
  newPasswordRepeated: Joi.ref("newPassword"),
}).meta({ className: "ChangePasswordRequest" });

export const requestResetPassword = Joi.object({
  email: Joi.string().trim().email().required(),
}).meta({ className: "RequestResetPasswordRequest" });

export const checkResetPasswordCode = Joi.object({
  email: Joi.string().trim().email().required(),
  code: Joi.string().trim().required(),
}).meta({ className: "CheckResetPasswordCodeRequest" });

export const resetPassword = Joi.object({
  email: Joi.string().trim().email().required(),
  code: Joi.string().trim().required(),
  newPassword: Joi.string().trim().required(),
  newPasswordRepeated: Joi.ref("newPassword"),
}).meta({ className: "ResetPasswordRequest" });

export const verifyAccount = Joi.object({
  username: Joi.string().trim().required(),
  code: Joi.string().trim().required(),
}).meta({ className: "VerifyAccountRequest" });

export const resendVerifyCode = Joi.object({
  username: Joi.string().trim().required(),
}).meta({ className: "ResendVerifyCodeRequest" });

export const checkUsername = Joi.object({
  username: Joi.string().trim().required(),
}).meta({ className: "CheckUsernameRequest" });

export const checkEmail = Joi.object({
  email: Joi.string().email().trim().required(),
}).meta({ className: "CheckEmailRequest" });

export default {
  login,
  register,
  editUser,
  changePassword,
  requestResetPassword,
  checkResetPasswordCode,
  resetPassword,
  verifyAccount,
  resendVerifyCode,
  checkUsername,
  checkEmail,
};
