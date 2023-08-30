import Joi from "joi";
import * as ibantools from "ibantools";

export const login = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
}).meta({ className: "LoginRequest" });

export const register = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  passwordRepeated: Joi.ref("password"),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  zipCode: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  houseNumber: Joi.string().required(),
  bank: Joi.string().required(),
  iban: Joi.string()
    .custom((value) => {
      return ibantools.isValidIBAN(value);
    })
    .required(),
  bic: Joi.string()
    .custom((value) => {
      return ibantools.isValidBIC(value);
    })
    .required(),
  taxNumber: Joi.string().required(),
  vatId: Joi.string().required(),
  telephone: Joi.string().required(),
  email: Joi.string().email().required(),
}).meta({ className: "RegisterRequest" });

export const editUser = Joi.object({
  username: Joi.string().optional(),
  firstName: Joi.string().optional(),
  lastName: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  city: Joi.string().optional(),
  street: Joi.string().optional(),
  houseNumber: Joi.string().optional(),
  bank: Joi.string().optional(),
  iban: Joi.string()
    .custom((value) => {
      return ibantools.isValidIBAN(value);
    })
    .optional(),
  bic: Joi.string()
    .custom((value) => {
      return ibantools.isValidBIC(value);
    })
    .optional(),
  taxNumber: Joi.string().optional(),
  vatId: Joi.string().optional(),
  telephone: Joi.string().optional(),
  email: Joi.string().email().optional(),
}).meta({ className: "EditUserRequest" });

export const changePassword = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required(),
  newPasswordRepeated: Joi.ref("newPassword"),
}).meta({ className: "ChangePasswordRequest" });

export const requestResetPassword = Joi.object({
  email: Joi.string().email().required(),
}).meta({ className: "RequestResetPasswordRequest" });

export const checkResetPasswordCode = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
}).meta({ className: "CheckResetPasswordCodeRequest" });

export const resetPassword = Joi.object({
  email: Joi.string().email().required(),
  code: Joi.string().required(),
  newPassword: Joi.string().required(),
  newPasswordRepeated: Joi.ref("newPassword"),
}).meta({ className: "ResetPasswordRequest" });

export const verifyAccount = Joi.object({
  username: Joi.string().required(),
  code: Joi.string().required(),
}).meta({ className: "VerifyAccountRequest" });

export const resendVerifyCode = Joi.object({
  username: Joi.string().required(),
}).meta({ className: "ResendVerifyCodeRequest" });

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
};
