import Joi from "joi";

import { PaymentDueUnit } from "@prisma/client";

export const addProject = Joi.object({
  name: Joi.string().trim().required(),
  paymentDue: Joi.number().integer().positive().required(),
  paymentDueUnit: Joi.string()
    .valid(...Object.values(PaymentDueUnit))
    .required(),
  customerId: Joi.number().integer().positive().required(),
  hourlyRate: Joi.number().positive().required(),
}).meta({ className: "AddProjectRequest" });

export const editProject = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().optional(),
  paymentDue: Joi.number().integer().positive().optional(),
  paymentDueUnit: Joi.string()
    .valid(...Object.values(PaymentDueUnit))
    .optional(),
  customerId: Joi.number().integer().positive().optional(),
  hourlyRate: Joi.number().positive().optional(),
  archived: Joi.boolean().optional(),
}).meta({ className: "EditProjectRequest" });

export const deleteProject = Joi.object({
  id: Joi.number().integer().positive().required(),
}).meta({ className: "DeleteProjectRequest" });

export default { addProject, editProject, deleteProject };
