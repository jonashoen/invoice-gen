import Joi from "joi";

export const addCustomer = Joi.object({
  name: Joi.string().trim().required(),
  number: Joi.string().trim().required(),
  zipCode: Joi.string().trim().required(),
  city: Joi.string().trim().required(),
  street: Joi.string().trim().required(),
  houseNumber: Joi.string().trim().required(),
}).meta({ className: "AddCustomerRequest" });

export const editCustomer = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().trim().optional(),
  number: Joi.string().trim().optional(),
  zipCode: Joi.string().trim().optional(),
  city: Joi.string().trim().optional(),
  street: Joi.string().trim().optional(),
  houseNumber: Joi.string().trim().optional(),
}).meta({ className: "EditCustomerRequest" });

export const deleteCustomer = Joi.object({
  id: Joi.number().integer().positive().required(),
}).meta({ className: "DeleteCustomerRequest" });

export default {
  addCustomer,
  editCustomer,
  deleteCustomer,
};
