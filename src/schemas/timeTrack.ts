import Joi from "joi";

export const startTimeTrackRequest = Joi.object({
  projectId: Joi.number().integer().positive().required(),
}).meta({ className: "StartTimeTrackRequest" });

export const stopTimeTrackRequest = Joi.object({
  activities: Joi.array().items(Joi.string().trim().required()).required(),
}).meta({ className: "StopTimeTrackRequest" });

export const editTimeTrackRequest = Joi.object({
  timeTrackId: Joi.number().integer().positive().required(),
  projectId: Joi.number().integer().positive().optional(),
  startTime: Joi.date().optional(),
  endTime: Joi.date().optional(),
  addedActivities: Joi.array()
    .items(
      Joi.object({
        description: Joi.string().trim().required(),
      }).optional()
    )
    .optional(),
  updatedActivities: Joi.array()
    .items(
      Joi.object({
        id: Joi.number().integer().positive().required(),
        description: Joi.string().trim().required(),
      }).optional()
    )
    .optional(),
  deletedActivities: Joi.array()
    .items(Joi.number().integer().positive().optional())
    .optional(),
}).meta({ className: "EditTimeTrackRequest" });

export const deleteTimeTrackRequest = Joi.object({
  timeTrackId: Joi.number().integer().positive().required(),
}).meta({ className: "DeleteTimeTrackRequest" });

export const exportTimeTracks = Joi.object({
  projectId: Joi.number().integer().positive().required(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
}).meta({ className: "ExportTimeTrackRequest" });

export const getTimeTrackedSinceLastInvoice = Joi.object({
  projectId: Joi.number().integer().positive().required(),
}).meta({ className: "GetTimeTrackedSinceLastInvoice" });

export default {
  startTimeTrackRequest,
  stopTimeTrackRequest,
  editTimeTrackRequest,
  deleteTimeTrackRequest,
  exportTimeTracks,
  getTimeTrackedSinceLastInvoice,
};
