interface RegisterRequest {
  username: string;
  password: string;
  passwordRepeated: string;
  firstName: string;
  lastName: string;
  zipCode: string;
  city: string;
  street: string;
  houseNumber: string;
  bank: string;
  iban: string;
  bic: string;
  taxNumber: string;
  vatId: string;
  telephone: string;
  email: string;
}

export default RegisterRequest;
