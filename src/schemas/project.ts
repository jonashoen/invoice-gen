import Joi from "joi";

import { PaymentDueUnit } from "@prisma/client";

export const addProjectRequest = Joi.object({
  name: Joi.string().required(),
  paymentDue: Joi.number().integer().positive().required(),
  paymentDueUnit: Joi.string()
    .valid(...Object.values(PaymentDueUnit))
    .required(),
  customerId: Joi.number().integer().positive().required(),
}).meta({ className: "AddProjectRequest" });

export const editProjectRequest = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().optional(),
  paymentDue: Joi.number().integer().positive().optional(),
  paymentDueUnit: Joi.string()
    .valid(...Object.values(PaymentDueUnit))
    .optional(),
  customerId: Joi.number().integer().positive().optional(),
}).meta({ className: "EditProjectRequest" });

export const deleteProjectRequest = Joi.object({
  id: Joi.number().integer().positive().required(),
}).meta({ className: "DeleteProjectRequest" });

export default { addProjectRequest, editProjectRequest, deleteProjectRequest };
