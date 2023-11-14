import Header from "@/components/Header";
import AddTimeTracking from "@/modals/AddTimeTracking";
import Paper from "@/components/Paper";
import dateToDateString from "@/helper/dateToDateString";
import StopTimeTracking from "@/modals/StopTimeTracking";
import group from "@/helper/groupArray";
import Details from "@/components/Details";
import ModalButton from "@/components/Button/ModalButton";
import isAuthed from "@/lib/isAuthed";
import timeTracking from "@/services/timeTracking";
import Stopwatch from "@/components/Stopwatch";
import getDurationString from "@/helper/getDurationString";
import RestartTimeTrackingButton from "@/components/Button/RestartTimeTrackingButton";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/de";
import LocalTime from "@/components/LocalTime";
import { Metadata } from "next";

dayjs.extend(utc);
dayjs.extend(duration);

const generateMetadata = async (): Promise<Metadata> => {
  const userId = await isAuthed();

  if (!userId) {
    return {};
  }

  const runningTimeTrack = await timeTracking.getRunning(userId!);

  const title = "Zeiterfassung - ig";

  return {
    title: runningTimeTrack ? `${title} 🔴` : title,
  };
};

const TimeTracking = async () => {
  const userId = await isAuthed();

  const timeTracks = await timeTracking.get(userId!);
  const groupedTimeTracks = group(timeTracks, {
    cb: (item) => dateToDateString(item.startTime),
  });

  const runningTimeTrack = await timeTracking.getRunning(userId!);

  return (
    <main>
      <Header title="Zeiterfassung">
        <ModalButton
          className="bg-pink text-white"
          disabled={!!runningTimeTrack}
          modal={{
            title: "Zeiterfassung starten",
            content: <AddTimeTracking />,
          }}
        >
          Starten
        </ModalButton>
      </Header>

      <div className="flex flex-col gap-12">
        {runningTimeTrack && (
          <div>
            <p className="text-2xl mb-4">Aktuelles Tracking:</p>
            <Paper className="!bg-purple_dark text-white">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p>
                    <span>
                      {dateToDateString(runningTimeTrack.startTime)},{" "}
                    </span>
                    <LocalTime date={runningTimeTrack.startTime} />
                  </p>
                  <p className="text-xl">
                    {runningTimeTrack.project.name} (
                    {runningTimeTrack.project.customer.name})
                  </p>
                </div>
                <div className="flex items-center gap-10">
                  <div className="flex items-center gap-5">
                    <div className="bg-red-600 h-5 aspect-square rounded-full">
                      <div className="bg-inherit w-full h-full rounded-full animate-ping" />
                    </div>
                    <p className="text-xl">
                      <Stopwatch startTime={runningTimeTrack.startTime} />
                    </p>
                  </div>

                  <ModalButton
                    className="bg-red-600"
                    modal={{
                      title: "Zeiterfassung stoppen",
                      content: <StopTimeTracking />,
                    }}
                  >
                    Stop
                  </ModalButton>
                </div>
              </div>
            </Paper>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <>
            {timeTracks.length === 0 && (
              <p className="text-center text-3xl mt-20">
                Noch keine Zeiten erfasst
              </p>
            )}
            {Object.keys(groupedTimeTracks).map((day) => {
              const millisecondsTracked = groupedTimeTracks[day].reduce(
                (sum, tt) => {
                  return sum + dayjs.utc(tt.endTime).diff(tt.startTime);
                },
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
                        <div className="flex justify-between items-center border-black border-b pb-4">
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
                                disabled={!!runningTimeTrack}
                              />
                            </div>
                          </div>
                        </div>

                        <ul className="mt-2">
                          {timeTrack.activities.map((activity) => (
                            <li key={activity.id}>- {activity.description}</li>
                          ))}
                        </ul>
                      </Paper>
                    ))}
                  </div>
                </Details>
              );
            })}
          </>
        </div>
      </div>
    </main>
  );
};

export default TimeTracking;
export { generateMetadata };
