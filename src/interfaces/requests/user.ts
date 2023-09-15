/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface ChangePasswordRequest {
  newPassword: string;
  newPasswordRepeated?: any;
  oldPassword: string;
}

export interface CheckEmailRequest {
  email: string;
}

export interface CheckResetPasswordCodeRequest {
  code: string;
  email: string;
}

export interface CheckUsernameRequest {
  username: string;
}

export interface EditUserRequest {
  bank?: string;
  bic?: string;
  city?: string;
  email?: string;
  firstName?: string;
  houseNumber?: string;
  iban?: string;
  lastName?: string;
  street?: string;
  taxNumber?: string;
  telephone?: string;
  username?: string;
  vatId?: string;
  zipCode?: string;
}

export interface LoginRequest {
  password: string;
  username: string;
}

export interface RegisterRequest {
  bank: string;
  bic: string;
  city: string;
  email: string;
  firstName: string;
  houseNumber: string;
  iban: string;
  lastName: string;
  password: string;
  passwordRepeated?: any;
  street: string;
  taxNumber: string;
  telephone: string;
  username: string;
  vatId: string;
  zipCode: string;
}

export interface RequestResetPasswordRequest {
  email: string;
}

export interface ResendVerifyCodeRequest {
  username: string;
}

export interface ResetPasswordRequest {
  code: string;
  email: string;
  newPassword: string;
  newPasswordRepeated?: any;
}

export interface VerifyAccountRequest {
  code: string;
  username: string;
}
