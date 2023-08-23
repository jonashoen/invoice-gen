interface EditUserRequest {
  username?: string;
  firstName?: string;
  lastName?: string;
  zipCode?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
  bank?: string;
  iban?: string;
  bic?: string;
  taxNumber?: string;
  vatId?: string;
  telephone?: string;
  email?: string;
}

interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
  newPasswordRepeated: string;
}

interface RequestResetPasswordRequest {
  email: string;
}

interface CheckResetPasswordCodeRequest {
  email: string;
  code: string;
}

interface ResetPasswordRequest {
  email: string;
  code: string;
  newPassword: string;
  newPasswordRepeated: string;
}

interface VerifyAccountRequest {
  username: string;
  code: string;
}

interface ResendVerifyCodeRequest {
  username: string;
}

export type {
  EditUserRequest,
  ChangePasswordRequest,
  RequestResetPasswordRequest,
  CheckResetPasswordCodeRequest,
  ResetPasswordRequest,
  VerifyAccountRequest,
  ResendVerifyCodeRequest,
};
