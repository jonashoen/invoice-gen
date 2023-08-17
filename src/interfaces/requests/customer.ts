interface AddCustomerRequest {
  name: string;
  number: string;
  zipCode: string;
  city: string;
  street: string;
  houseNumber: string;
}

interface EditCustomerRequest {
  id: number;
  name?: string;
  number?: string;
  zipCode?: string;
  city?: string;
  street?: string;
  houseNumber?: string;
}

interface DeleteCustomerRequest {
  id: number;
}

export type { AddCustomerRequest, EditCustomerRequest, DeleteCustomerRequest };
