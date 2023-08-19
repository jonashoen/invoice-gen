import { InvoicePositionUnit } from "@prisma/client";

interface AddInvoiceRequest {
  projectId: number;
  positions: {
    amount: number;
    unit: InvoicePositionUnit;
    description: string;
    price: number;
  }[];
}

interface EditInvoiceRequest {
  id: number;
  projectId?: number;
  deletedPositions?: {
    id: number;
  }[];
  positions?: {
    id: number;
    amount?: number;
    unit?: InvoicePositionUnit;
    description?: string;
    price?: number;
    added?: boolean;
  }[];
}

interface DeleteInvoiceRequest {
  id: number;
}

interface PublishInvoiceRequest {
  id: number;
}

export type {
  AddInvoiceRequest,
  EditInvoiceRequest,
  DeleteInvoiceRequest,
  PublishInvoiceRequest,
};
