/**
 * This file was automatically generated by joi-to-typescript
 * Do not modify this file manually
 */

export interface AddProjectRequest {
  customerId: number;
  name: string;
  paymentDue: number;
  paymentDueUnit: 'days' | 'week' | 'weeks' | 'month' | 'months';
}

export interface DeleteProjectRequest {
  id: number;
}

export interface EditProjectRequest {
  customerId?: number;
  id: number;
  name?: string;
  paymentDue?: number;
  paymentDueUnit?: 'days' | 'week' | 'weeks' | 'month' | 'months';
}
