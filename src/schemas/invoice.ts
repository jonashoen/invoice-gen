import Joi from "joi";

import { InvoicePositionUnit } from "@prisma/client";

const addInvoiceRequest = Joi.object({
  projectId: Joi.number().integer().positive().required(),
  positions: Joi.array()
    .items(
      Joi.object({
        amount: Joi.number().positive().required(),
        unit: Joi.string()
          .valid(...Object.values(InvoicePositionUnit))
          .required(),
        description: Joi.string().required(),
        price: Joi.number().positive().required(),
      }).required()
    )
    .required(),
}).meta({ className: "AddInvoiceRequest" });

const editInvoiceRequest = Joi.object({
  id: Joi.number().integer().positive().required(),
  projectId: Joi.number().integer().positive().optional(),
  deletedPositions: Joi.array()
    .items(Joi.number().integer().positive().required())
    .optional(),
  positions: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().positive().required(),
        amount: Joi.number().positive().optional(),
        unit: Joi.string()
          .valid(...Object.values(InvoicePositionUnit))
          .optional(),
        description: Joi.string().optional(),
        price: Joi.number().positive().optional(),
        added: Joi.boolean().optional(),
      })
    )
    .optional(),
}).meta({ className: "EditInvoiceRequest" });

const deleteInvoiceRequest = Joi.object({
  id: Joi.number().integer().positive().required(),
}).meta({ className: "DeleteInvoiceRequest" });

const publishInvoiceRequest = Joi.object({
  id: Joi.number().integer().positive().required(),
}).meta({ className: "PublishInvoiceRequest" });

export default {
  addInvoiceRequest,
  editInvoiceRequest,
  deleteInvoiceRequest,
  publishInvoiceRequest,
};
