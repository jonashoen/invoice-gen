import Joi from "joi";

export const startTimeTrackRequest = Joi.object({
  projectId: Joi.number().integer().positive().required(),
}).meta({ className: "StartTimeTrackRequest" });

export const stopTimeTrackRequest = Joi.object({
  timeTrackId: Joi.number().integer().positive().required(),
  description: Joi.string().trim().required(),
}).meta({ className: "StopTimeTrackRequest" });

export const editTimeTrackRequest = Joi.object({
  timeTrackId: Joi.number().integer().positive().required(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  description: Joi.string().trim().optional(),
}).meta({ className: "EditTimeTrackRequest" });

export const deleteTimeTrackRequest = Joi.object({
  timeTrackId: Joi.number().integer().positive().required(),
}).meta({ className: "DeleteTimeTrackRequest" });

export default {
  startTimeTrackRequest,
  stopTimeTrackRequest,
  editTimeTrackRequest,
  deleteTimeTrackRequest,
};
