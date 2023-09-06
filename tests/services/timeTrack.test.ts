import timeTrackService from "@/services/timeTracking";
import { prismaMock } from "../__helper/mockDb";
import { Project, TimeTrack, TimeTrackActivity } from "@prisma/client";
import dayjs from "dayjs";

const userId = -1;
const testTimeTrack: TimeTrack = {
  id: -1,
  projectId: -1,
  startTime: dayjs().toDate(),
  endTime: dayjs().add(1, "day").toDate(),
};

const testTimeTrackActivity = {
  id: -1,
};

describe("Time track tests", () => {
  test("Get tracked times", async () => {
    prismaMock.timeTrack.findMany.mockResolvedValueOnce([testTimeTrack]);

    const trackedTimes = await timeTrackService.get(userId);

    expect(trackedTimes).toEqual([testTimeTrack]);
  });

  test("Get running time track", async () => {
    prismaMock.timeTrack.findFirst.mockResolvedValueOnce(testTimeTrack);

    const runningTimeTrack = await timeTrackService.getRunning(userId);

    expect(runningTimeTrack).toEqual(testTimeTrack);
  });

  describe("Start time tracking", () => {
    test("User already has running time tracking", async () => {
      prismaMock.timeTrack.findFirst.mockResolvedValueOnce(testTimeTrack);

      const startedTimeTracking = await timeTrackService.start(userId, {
        projectId: testTimeTrack.projectId,
      });

      expect(startedTimeTracking).toBeNull();
    });

    test("Project doesn't exist", async () => {
      prismaMock.timeTrack.findFirst.mockResolvedValueOnce(null);
      prismaMock.project.findUnique.mockResolvedValueOnce(null);

      const startedTimeTracking = await timeTrackService.start(userId, {
        projectId: testTimeTrack.projectId,
      });

      expect(startedTimeTracking).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.timeTrack.findFirst.mockResolvedValueOnce(null);
      prismaMock.project.findUnique.mockResolvedValueOnce({} as Project);
      prismaMock.timeTrack.create.mockResolvedValueOnce(testTimeTrack);

      const startedTimeTracking = await timeTrackService.start(userId, {
        projectId: testTimeTrack.projectId,
      });

      expect(startedTimeTracking).toEqual(testTimeTrack);
    });
  });

  describe("Stop time tracking", () => {
    test("No activities", async () => {
      const stopedTimeTracking = await timeTrackService.stop(userId, {
        activities: [],
      });

      expect(stopedTimeTracking).toBeNull();
    });

    test("Time tracking entry doesn't exist", async () => {
      prismaMock.timeTrack.findFirst.mockResolvedValueOnce(null);

      const stopedTimeTracking = await timeTrackService.stop(userId, {
        activities: ["Foo", "Bar"],
      });

      expect(stopedTimeTracking).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.timeTrack.findFirst.mockResolvedValueOnce(testTimeTrack);
      prismaMock.timeTrack.update.mockResolvedValueOnce(testTimeTrack);

      const stopedTimeTracking = await timeTrackService.stop(userId, {
        activities: ["Foo", "Bar"],
      });

      expect(stopedTimeTracking).toEqual(testTimeTrack);
    });
  });

  describe("Edit time tracking", () => {
    test("Time tracking entry doesn't exist", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce(null);

      const editedTimeTracking = await timeTrackService.edit(userId, {
        timeTrackId: testTimeTrack.id,
      });

      expect(editedTimeTracking).toBeNull();
    });

    test("New start time after new end time", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce(testTimeTrack);

      const editedTimeTracking = await timeTrackService.edit(userId, {
        timeTrackId: testTimeTrack.id,
        startTime: dayjs().toDate(),
        endTime: dayjs().subtract(1, "day").toDate(),
      });

      expect(editedTimeTracking).toBeNull();
    });

    test("New start time after old end time", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce({
        ...testTimeTrack,
        endTime: dayjs().subtract(1, "day").toDate(),
      });

      const editedTimeTracking = await timeTrackService.edit(userId, {
        timeTrackId: testTimeTrack.id,
        startTime: dayjs().toDate(),
      });

      expect(editedTimeTracking).toBeNull();
    });

    test("New end time before old start time", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce({
        ...testTimeTrack,
        startTime: dayjs().add(1, "day").toDate(),
      });

      const editedTimeTracking = await timeTrackService.edit(userId, {
        timeTrackId: testTimeTrack.id,
        endTime: dayjs().toDate(),
      });

      expect(editedTimeTracking).toBeNull();
    });

    test("Updated activities don't match with database ones", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce(testTimeTrack);
      prismaMock.timeTrackActivity.count.mockResolvedValueOnce(2);

      const editedTimeTracking = await timeTrackService.edit(userId, {
        timeTrackId: testTimeTrack.id,
        updatedActivities: [
          { id: testTimeTrackActivity.id } as TimeTrackActivity,
        ],
      });

      expect(editedTimeTracking).toBeNull();
    });

    test("Deleted activities don't match with database ones", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce(testTimeTrack);
      prismaMock.timeTrackActivity.count.mockResolvedValueOnce(2);

      const editedTimeTracking = await timeTrackService.edit(userId, {
        timeTrackId: testTimeTrack.id,
        deletedActivities: [testTimeTrackActivity.id],
      });

      expect(editedTimeTracking).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce(testTimeTrack);
      prismaMock.timeTrackActivity.count.mockResolvedValueOnce(1);
      prismaMock.timeTrackActivity.count.mockResolvedValueOnce(1);
      prismaMock.timeTrack.update.mockResolvedValueOnce(testTimeTrack);

      const editedTimeTracking = await timeTrackService.edit(userId, {
        timeTrackId: testTimeTrack.id,
        updatedActivities: [
          { id: testTimeTrackActivity.id } as TimeTrackActivity,
        ],
        deletedActivities: [testTimeTrackActivity.id],
        addedActivities: [testTimeTrackActivity as TimeTrackActivity],
      });

      expect(editedTimeTracking).toEqual(testTimeTrack);
    });

    test("Valid data no activity updates", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce(testTimeTrack);
      prismaMock.timeTrackActivity.count.mockResolvedValueOnce(1);
      prismaMock.timeTrackActivity.count.mockResolvedValueOnce(1);
      prismaMock.timeTrack.update.mockResolvedValueOnce(testTimeTrack);

      const editedTimeTracking = await timeTrackService.edit(userId, {
        timeTrackId: testTimeTrack.id,
        startTime: dayjs().toDate(),
        endTime: dayjs().add(1, "day").toDate(),
      });

      expect(editedTimeTracking).toEqual(testTimeTrack);
    });
  });

  describe("Delete time tracking tests", () => {
    test("Time tracking entry doesn't exist", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce(null);

      const deletedTimeTracking = await timeTrackService.deleteEntry(userId, {
        timeTrackId: testTimeTrack.id,
      });

      expect(deletedTimeTracking).toBeNull();
    });

    test("Valid data", async () => {
      prismaMock.timeTrack.findUnique.mockResolvedValueOnce(testTimeTrack);
      prismaMock.timeTrack.delete.mockResolvedValueOnce(testTimeTrack);

      const deletedTimeTracking = await timeTrackService.deleteEntry(userId, {
        timeTrackId: testTimeTrack.id,
      });

      expect(deletedTimeTracking).toEqual(testTimeTrack);
    });
  });
});
