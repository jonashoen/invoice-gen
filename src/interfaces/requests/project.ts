import { PaymentDueUnit } from "@prisma/client";

interface AddProjectRequest {
  name: string;
  paymentDue: number;
  paymentDueUnit: PaymentDueUnit;
  customerId: number;
}

interface EditProjectRequest {
  id: number;
  name?: string;
  paymentDue?: number;
  paymentDueUnit?: PaymentDueUnit;
  customerId?: number;
}

interface DeleteProjectRequest {
  id: number;
}

export type { AddProjectRequest, EditProjectRequest, DeleteProjectRequest };
