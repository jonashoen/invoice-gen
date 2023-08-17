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

export type { EditUserRequest, ChangePasswordRequest };
