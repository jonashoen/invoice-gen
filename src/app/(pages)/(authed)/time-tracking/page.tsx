import Header from "@/components/Header";
import AddTimeTracking from "@/modals/AddTimeTracking";
import Paper from "@/components/Paper";
import dateToDateString from "@/helper/dateToDateString";
import StopTimeTracking from "@/modals/StopTimeTracking";
import dateToTimeString from "@/helper/dateToTimeString";
import group from "@/helper/groupArray";
import Details from "@/components/Details";
import ModalButton from "@/components/Button/ModalButton";
import isAuthed from "@/lib/isAuthed";
import timeTracking from "@/services/timeTracking";
import Stopwatch from "@/components/Stopwatch";
import getDurationString from "@/helper/getDurationString";
import RestartTimeTrackingButton from "@/components/Button/RestartTimeTrackingButton";

const metadata = { title: "Zeiterfassung - ig" };

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
                    <span>
                      {dateToTimeString(runningTimeTrack.startTime)} Uhr
                    </span>
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
            {Object.keys(groupedTimeTracks).map((day) => (
              <Details title={day} key={day}>
                <div className="flex flex-col gap-4">
                  {groupedTimeTracks[day].map((timeTrack) => (
                    <Paper key={timeTrack.id}>
                      <div className="flex justify-between items-center border-black border-b pb-4">
                        <div className="flex flex-col">
                          <p>{dateToDateString(timeTrack.startTime)}</p>
                          <p className="text-xl">
                            {timeTrack.project.name} (
                            {timeTrack.project.customer.name})
                          </p>
                        </div>

                        <div className="flex flex-ol gap-4">
                          <p>{dateToTimeString(timeTrack.startTime)} Uhr</p>
                          <p>-</p>
                          <p>{dateToTimeString(timeTrack.endTime!)} Uhr</p>
                        </div>

                        <div className="flex items-center gap-10">
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
                                    oldStartTime={new Date(timeTrack.startTime)}
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
            ))}
          </>
        </div>
      </div>
    </main>
  );
};

export default TimeTracking;
export { metadata };
