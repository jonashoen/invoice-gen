import db from "@/db";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

const get = async (userId: number) => {
  return await db.timeTrack.findMany({
    where: {
      project: {
        customer: {
          userId,
        },
      },
    },
  });
};

const getRunning = async (userId: number) => {
  return await db.timeTrack.findFirst({
    where: {
      endTime: null,
    },
  });
};

const start = async (userId: number, { projectId }: { projectId: number }) => {
  const project = await db.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!project) {
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
  { timeTrackId, description }: { timeTrackId: number; description: string }
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

  return await db.timeTrack.update({
    where: {
      id: timeTrackId,
    },
    data: {
      endTime: dayjs.utc().toDate(),
      description,
    },
  });
};

const edit = async (
  userId: number,
  {
    timeTrackId,
    startTime,
    endTime,
    description,
  }: {
    timeTrackId: number;
    startTime?: Date;
    endTime?: Date;
    description?: string;
  }
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

  if (
    startTime &&
    timeTrack.endTime &&
    startTime.valueOf() > timeTrack.endTime.valueOf()
  ) {
    return null;
  }

  if (endTime && endTime.valueOf() < timeTrack.startTime.valueOf()) {
    return null;
  }

  if (startTime && endTime && startTime.valueOf() > endTime.valueOf()) {
    return null;
  }

  return await db.timeTrack.update({
    where: {
      id: timeTrackId,
    },
    data: {
      startTime: startTime && dayjs.utc(startTime).toDate(),
      endTime: endTime && dayjs.utc(endTime).toDate(),
      description,
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

export default { get, getRunning, start, stop, edit, deleteEntry };
