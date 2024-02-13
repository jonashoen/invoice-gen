"use client";

import ModalButton from "@/components/Button/ModalButton";
import RestartTimeTrackingButton from "@/components/Button/RestartTimeTrackingButton";
import Details from "@/components/Details";
import LocalTime from "@/components/LocalTime";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import getDurationString from "@/helper/getDurationString";
import group from "@/helper/groupArray";
import AddTimeTracking from "@/modals/AddTimeTracking";
import { TimeTrack, TimeTrackActivity } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

interface Props {
  groupedTimeTracks: {
    [key: string]: (TimeTrack & {
      project: { name: string; archived: boolean } & {
        customer: { name: string };
      };
      activities: TimeTrackActivity[];
    })[];
  };
  isTracking: boolean;
}

const TimeTracks: React.FC<Props> = ({ groupedTimeTracks, isTracking }) => {
  return (
    <Pagination data={Object.keys(groupedTimeTracks)} pageSize={10}>
      {(paginatedDays) => {
        return Object.keys(groupedTimeTracks)
          .filter((day) => paginatedDays.includes(day))
          .map((day) => {
            const millisecondsTracked = groupedTimeTracks[day].reduce(
              (sum, tt) => sum + dayjs.utc(tt.endTime).diff(tt.startTime),
              0
            );

            const trackedTodayString =
              getDurationString(millisecondsTracked) || "0h";

            const groupedTimeTracksByProjectAndDate = group(
              groupedTimeTracks[day],
              { key: "projectId" }
            );

            return (
              <Details title={`${day} (${trackedTodayString})`} key={day}>
                <div className="flex flex-col gap-4">
                  {Object.keys(groupedTimeTracksByProjectAndDate).map(
                    (projectId) => {
                      const baseTimeTrack =
                        groupedTimeTracksByProjectAndDate[projectId][0];

                      const project = baseTimeTrack.project;

                      return (
                        <Paper key={day + projectId} className="!py-6">
                          <div className="flex justify-between items-center border-black border-b pb-4">
                            <p className="flex-1 text-xl">
                              {project.name} ({project.customer.name})
                            </p>

                            {!project.archived && (
                              <RestartTimeTrackingButton
                                projectId={baseTimeTrack.projectId}
                                disabled={isTracking}
                              />
                            )}
                          </div>

                          {groupedTimeTracksByProjectAndDate[projectId].map(
                            (timeTrack) => (
                              <div
                                key={timeTrack.id}
                                className="flex bg-gray-100 items-start gap-4 p-4 py-4 mt-4 rounded-lg"
                              >
                                <Paper className="flex-1">
                                  <ul className="pl-8 list-['-_']">
                                    {timeTrack.activities.map((activity) => (
                                      <li key={activity.id}>
                                        {activity.description}
                                      </li>
                                    ))}
                                  </ul>
                                </Paper>

                                <div className="flex items-center justify-between flex-1 gap-10">
                                  <div className="flex gap-4 text-lg items-center ml-12">
                                    <LocalTime date={timeTrack.startTime} />
                                    <p>-</p>
                                    <LocalTime date={timeTrack.endTime!} />
                                    <p className="text-base">
                                      (
                                      {getDurationString(
                                        timeTrack.startTime,
                                        timeTrack.endTime
                                      ) || "0h"}
                                      )
                                    </p>
                                  </div>

                                  {!timeTrack.project.archived && (
                                    <div className="flex gap-2">
                                      <ModalButton
                                        className="bg-white"
                                        modal={{
                                          title: "Zeiterfassung bearbeiten",
                                          content: (
                                            <AddTimeTracking
                                              timeTrackId={timeTrack.id}
                                              oldProjectId={timeTrack.projectId}
                                              oldStartTime={
                                                new Date(timeTrack.startTime)
                                              }
                                              oldEndTime={
                                                new Date(timeTrack.endTime!)
                                              }
                                              oldActivities={
                                                timeTrack.activities
                                              }
                                            />
                                          ),
                                        }}
                                      >
                                        Bearbeiten
                                      </ModalButton>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </Paper>
                      );
                    }
                  )}
                </div>
              </Details>
            );
          });
      }}
    </Pagination>
  );
};

export default TimeTracks;
