"use client";

import ModalButton from "@/components/Button/ModalButton";
import RestartTimeTrackingButton from "@/components/Button/RestartTimeTrackingButton";
import Details from "@/components/Details";
import LocalTime from "@/components/LocalTime";
import Pagination from "@/components/Pagination";
import Paper from "@/components/Paper";
import getDurationString from "@/helper/getDurationString";
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

            const virtualTrackingStarted = dayjs
              .utc()
              .subtract(millisecondsTracked, "milliseconds")
              .toDate();

            const trackedTodayString =
              getDurationString(virtualTrackingStarted) || "0h";

            return (
              <Details title={`${day} (${trackedTodayString})`} key={day}>
                <div className="flex flex-col gap-4">
                  {groupedTimeTracks[day].map((timeTrack) => (
                    <Paper key={timeTrack.id}>
                      <div className="flex justify-between items-center border-black border-b pb-[12px]">
                        <p className="flex-1 text-xl">
                          {timeTrack.project.name} (
                          {timeTrack.project.customer.name})
                        </p>

                        <div className="flex gap-4">
                          <LocalTime date={timeTrack.startTime} />
                          <p>-</p>
                          <LocalTime date={timeTrack.endTime!} />
                        </div>
                        <div className="flex flex-1 items-center justify-end gap-10">
                          <p className="text-xl">
                            {getDurationString(
                              timeTrack.startTime,
                              timeTrack.endTime
                            ) || "0h"}
                          </p>

                          {!timeTrack.project.archived && (
                            <div className="flex gap-2">
                              <ModalButton
                                modal={{
                                  title: "Zeiterfassung bearbeiten",
                                  content: (
                                    <AddTimeTracking
                                      timeTrackId={timeTrack.id}
                                      oldProjectId={timeTrack.projectId}
                                      oldStartTime={
                                        new Date(timeTrack.startTime)
                                      }
                                      oldEndTime={new Date(timeTrack.endTime!)}
                                      oldActivities={timeTrack.activities}
                                    />
                                  ),
                                }}
                              >
                                Bearbeiten
                              </ModalButton>

                              <RestartTimeTrackingButton
                                projectId={timeTrack.projectId}
                                disabled={isTracking}
                              />
                            </div>
                          )}
                        </div>
                      </div>

                      <ul className="mt-2 ml-4 list-['-_']">
                        {timeTrack.activities.map((activity) => (
                          <li key={activity.id}>{activity.description}</li>
                        ))}
                      </ul>
                    </Paper>
                  ))}
                </div>
              </Details>
            );
          });
      }}
    </Pagination>
  );
};

export default TimeTracks;
