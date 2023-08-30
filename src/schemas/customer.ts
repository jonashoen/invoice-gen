import Joi from "joi";

export const addCustomer = Joi.object({
  name: Joi.string().required(),
  number: Joi.string().required(),
  zipCode: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  houseNumber: Joi.string().required(),
}).meta({ className: "AddCustomerRequest" });

export const editCustomer = Joi.object({
  id: Joi.number().integer().positive().required(),
  name: Joi.string().optional(),
  number: Joi.string().optional(),
  zipCode: Joi.string().optional(),
  city: Joi.string().optional(),
  street: Joi.string().optional(),
  houseNumber: Joi.string().optional(),
}).meta({ className: "EditCustomerRequest" });

export const deleteCustomer = Joi.object({
  id: Joi.number().integer().positive().required(),
}).meta({ className: "DeleteCustomerRequest" });

export default {
  addCustomer,
  editCustomer,
  deleteCustomer,
};
