import Joi from "joi";

import { InvoicePositionUnit } from "@prisma/client";

export const addInvoice = Joi.object({
  projectId: Joi.number().integer().positive().required(),
  positions: Joi.array()
    .items(
      Joi.object({
        amount: Joi.number().positive().required(),
        unit: Joi.string()
          .valid(...Object.values(InvoicePositionUnit))
          .required(),
        description: Joi.string().trim().required(),
        price: Joi.number().positive().required(),
      }).required()
    )
    .required(),
}).meta({ className: "AddInvoiceRequest" });

export const editInvoice = Joi.object({
  id: Joi.number().integer().positive().required(),
  projectId: Joi.number().integer().positive().optional(),
  addedPositions: Joi.array()
    .items(
      Joi.object({
        amount: Joi.number().positive().required(),
        unit: Joi.string()
          .valid(...Object.values(InvoicePositionUnit))
          .required(),
        description: Joi.string().trim().required(),
        price: Joi.number().positive().required(),
      }).optional()
    )
    .optional(),
  updatedPositions: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().positive().required(),
        amount: Joi.number().positive().optional(),
        unit: Joi.string()
          .valid(...Object.values(InvoicePositionUnit))
          .optional(),
        description: Joi.string().trim().optional(),
        price: Joi.number().positive().optional(),
      }).optional()
    )
    .optional(),
  deletedPositions: Joi.array()
    .items(Joi.number().integer().positive().optional())
    .optional(),
}).meta({ className: "EditInvoiceRequest" });

export const deleteInvoice = Joi.object({
  id: Joi.number().integer().positive().required(),
}).meta({ className: "DeleteInvoiceRequest" });

export const publishInvoice = Joi.object({
  id: Joi.number().integer().positive().required(),
}).meta({ className: "PublishInvoiceRequest" });

export default {
  addInvoice,
  editInvoice,
  deleteInvoice,
  publishInvoice,
};
