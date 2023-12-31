/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface AddCustomerRequest {
  city: string;
  houseNumber: string;
  name: string;
  number: string;
  street: string;
  zipCode: string;
}

export interface DeleteCustomerRequest {
  id: number;
}

export interface EditCustomerRequest {
  city?: string;
  houseNumber?: string;
  id: number;
  name?: string;
  number?: string;
  street?: string;
  zipCode?: string;
}
