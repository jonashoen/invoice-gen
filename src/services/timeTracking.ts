import db from "@/db";
import group from "@/helper/groupArray";
import TimeTrackExportResponse from "@/interfaces/responses/TimeTrackExportResponse";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";

dayjs.extend(utc);
dayjs.extend(duration);

const get = async (userId: number) => {
  return await db.timeTrack.findMany({
    where: {
      endTime: {
        not: null,
      },
      project: {
        customer: {
          userId,
        },
      },
    },
    orderBy: {
      startTime: "desc",
    },
    include: {
      project: {
        select: {
          name: true,
          archived: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
      },
      activities: {
        orderBy: {
          id: "asc",
        },
      },
    },
  });
};

const getRunning = async (userId: number) => {
  return await db.timeTrack.findFirst({
    where: {
      endTime: null,
      project: {
        customer: {
          userId,
        },
      },
    },
    include: {
      project: {
        select: {
          name: true,
          customer: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
};

const start = async (userId: number, { projectId }: { projectId: number }) => {
  const runningTimeTracking = await getRunning(userId);

  if (runningTimeTracking) {
    return null;
  }

  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project || project.archived) {
    return null;
  }

  return await db.timeTrack.create({
    data: {
      projectId,
    },
  });
};

const stop = async (
  userId: number,
  { activities }: { activities: string[] }
) => {
  if (activities.length === 0) {
    return null;
  }

  const timeTrack = await getRunning(userId);

  if (!timeTrack) {
    return null;
  }

  return await db.timeTrack.update({
    where: {
      id: timeTrack.id,
    },
    data: {
      startTime: dayjs.utc(timeTrack.startTime).startOf("minute").toDate(),
      endTime: dayjs.utc().startOf("minute").toDate(),
      activities: {
        createMany: {
          data: activities.map((activity) => ({ description: activity })),
        },
      },
    },
  });
};

const edit = async (
  userId: number,
  {
    timeTrackId,
    projectId,
    startTime,
    endTime,
    addedActivities,
    updatedActivities,
    deletedActivities,
  }: {
    timeTrackId: number;
    projectId?: number;
    startTime?: Date;
    endTime?: Date;
    addedActivities?: { description: string }[];
    updatedActivities?: { id: number; description: string }[];
    deletedActivities?: number[];
  }
) => {
  const timeTrack = await db.timeTrack.findUnique({
    where: {
      id: timeTrackId,
      project: {
        archived: false,
        customer: {
          userId,
        },
      },
    },
    include: {
      activities: true,
    },
  });

  if (!timeTrack) {
    return null;
  }

  if (projectId) {
    const project = await db.project.findUnique({
      where: {
        id: projectId,
      },
    });

    if (!project || project.archived) {
      return null;
    }
  }

  if (startTime && endTime) {
    if (startTime.valueOf() > endTime.valueOf()) {
      return null;
    }
  } else if (
    startTime &&
    timeTrack.endTime &&
    startTime.valueOf() > timeTrack.endTime.valueOf()
  ) {
    return null;
  } else if (endTime && endTime.valueOf() < timeTrack.startTime.valueOf()) {
    return null;
  }

  if (updatedActivities && updatedActivities.length !== 0) {
    const oldActivitiesToEditCount = await db.timeTrackActivity.count({
      where: {
        id: {
          in: updatedActivities.map((activity) => activity.id),
        },
      },
    });

    if (oldActivitiesToEditCount !== updatedActivities.length) {
      return null;
    }
  }

  if (deletedActivities && deletedActivities.length !== 0) {
    const oldActivitiesToDeleteCount = await db.timeTrackActivity.count({
      where: {
        id: {
          in: deletedActivities,
        },
      },
    });

    if (oldActivitiesToDeleteCount !== deletedActivities.length) {
      return null;
    }
  }

  return await db.timeTrack.update({
    where: {
      id: timeTrackId,
    },
    data: {
      projectId,
      startTime: startTime && dayjs.utc(startTime).toDate(),
      endTime: endTime && dayjs.utc(endTime).toDate(),
      activities: {
        createMany: addedActivities && {
          data: addedActivities,
        },
        updateMany:
          updatedActivities &&
          updatedActivities.map((activity) => ({
            where: {
              id: activity.id,
            },
            data: {
              description: activity.description,
            },
          })),
        deleteMany:
          deletedActivities &&
          deletedActivities.map((activity) => ({ id: activity })),
      },
    },
  });
};

const deleteEntry = async (
  userId: number,
  { timeTrackId }: { timeTrackId: number }
) => {
  const timeTrack = await db.timeTrack.findUnique({
    where: {
      id: timeTrackId,
      project: {
        customer: {
          userId,
        },
      },
    },
  });

  if (!timeTrack) {
    return null;
  }

  return await db.timeTrack.delete({
    where: {
      id: timeTrackId,
    },
  });
};

const exportTimeTracking = async (
  userId: number,
  {
    projectId,
    startDate,
    endDate,
  }: { projectId: number; startDate: Date; endDate: Date }
) => {
  const project = await db.project.findUnique({
    where: {
      id: projectId,

      customer: {
        userId,
      },
    },
  });

  if (!project || project.archived) {
    return null;
  }

  const timeTracks = await db.timeTrack.findMany({
    where: {
      projectId,
      startTime: {
        gte: startDate,
      },
      endTime: {
        lte: dayjs.utc(endDate).endOf("day").toDate(),
      },
    },
    orderBy: {
      startTime: "asc",
    },
    include: {
      activities: true,
    },
  });

  const groupedTimeTracks = group(timeTracks, {
    cb: (tt) => dayjs.utc(tt.startTime).startOf("day").toISOString(),
  });

  const timeTrackExportData: TimeTrackExportResponse[] = [];

  for (const date of Object.keys(groupedTimeTracks)) {
    const allActivitiesOfDay = groupedTimeTracks[date]
      .map((timeTrack) =>
        timeTrack.activities.map((activity) => activity.description)
      )
      .flat();

    timeTrackExportData.push({
      date: dayjs.utc(date).toDate(),
      duration: groupedTimeTracks[date].reduce(
        (hours, { startTime, endTime }) => {
          const trackDuration = dayjs.duration(
            dayjs(endTime).diff(startTime, "minutes"),
            "minutes"
          );

          return hours + trackDuration.as("hours");
        },
        0
      ),
      activities: allActivitiesOfDay.filter(
        (activity, index) => allActivitiesOfDay.indexOf(activity) === index
      ),
    });
  }

  return timeTrackExportData;
};

export default {
  get,
  getRunning,
  start,
  stop,
  edit,
  deleteEntry,
  exportTimeTracking,
};
