"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import useModalStore from "@/store/modalStore";
import AddTimeTracking from "./AddTimeTracking";
import useApi from "@/hooks/useApi";
import {
  Customer,
  Project,
  TimeTrack,
  TimeTrackActivity,
} from "@prisma/client";
import Api from "@/routes/Api";
import Paper from "@/components/Paper";
import { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/de";
import dateToDateString from "@/helper/dateToDateString";
import Loader from "@/components/Loader";
import StopTimeTracking from "./StopTimeTracking";
import dateToTimeString from "@/helper/dateToTimeString";
import group from "@/helper/groupArray";
import Details from "@/components/Details";

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.locale("de");

const TimeTracking = () => {
  const showModal = useModalStore((state) => state.show);

  const intervalRef = useRef<number | null>(null);

  const { data: timeTracks, isFetching: timeTracksFetching } = useApi<
    (TimeTrack & {
      project: Project & { customer: Customer };
      activities: TimeTrackActivity[];
    })[]
  >({
    route: Api.TimeTracking,
    onSuccess: (data) => {
      const groupedData = group(data, {
        cb: (item) => dateToDateString(item.startTime),
      });

      setGroupedTimeTracks(groupedData);
    },
  });

  const { data: runningTimeTrack, isFetching: runningTimeTrackFetching } =
    useApi<(TimeTrack & { project: Project & { customer: Customer } }) | null>({
      route: Api.RunningTimeTrack,
      onSuccess: (data) => {
        if (data) {
          setRunningTimeTrackDuration(
            getDurationString(data.startTime, undefined, true)
          );

          intervalRef.current = setInterval(() => {
            setRunningTimeTrackDuration(
              getDurationString(data.startTime, undefined, true)
            );
          }, 1000) as any as number;
        }
      },
    });

  const [groupedTimeTracks, setGroupedTimeTracks] = useState<{
    [key: string]: typeof timeTracks;
  }>({});
  const [runningTimeTrackDuration, setRunningTimeTrackDuration] = useState("");

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <main>
      <Header title="Zeiterfassung">
        <Button
          className="bg-pink text-white"
          loading={runningTimeTrackFetching}
          disabled={!!runningTimeTrack}
          onClick={() =>
            showModal({
              title: "Zeiterfassung starten",
              content: <AddTimeTracking />,
            })
          }
        >
          Starten
        </Button>
      </Header>

      <div className="flex flex-col gap-12">
        {runningTimeTrack && (
          <div>
            <p className="text-2xl mb-4">Aktuelles Tracking:</p>
            <Paper className="!bg-purple_dark text-white">
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <p>{dateToDateString(runningTimeTrack.startTime)}</p>
                  <p className="text-xl">
                    {runningTimeTrack.project.name} (
                    {runningTimeTrack.project.customer.name})
                  </p>
                </div>

                <div className="flex items-center gap-10">
                  <p className="text-xl">{runningTimeTrackDuration}</p>
                  <Button
                    className="bg-red-600"
                    onClick={() =>
                      showModal({
                        title: "Zeiterfassung stoppen",
                        content: <StopTimeTracking ref={intervalRef} />,
                      })
                    }
                  >
                    Stop
                  </Button>
                </div>
              </div>
            </Paper>
          </div>
        )}

        <div className="flex flex-col gap-6">
          {!timeTracksFetching ? (
            <>
              {timeTracks.length === 0 && (
                <p className="text-center text-3xl mt-20">
                  Noch keine Zeiten erfasst
                </p>
              )}
              {Object.keys(groupedTimeTracks).map((day) => (
                <Details title={day} key={day}>
                  <div className="flex flex-col gap-4 mt-4">
                    {groupedTimeTracks[day].map((timeTrack) => (
                      <Paper key={timeTrack.id}>
                        <div className="flex justify-between items-center">
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
                              )}
                            </p>
                            <Button
                              onClick={() =>
                                showModal({
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
                                })
                              }
                            >
                              Bearbeiten
                            </Button>
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
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </main>
  );
};

export default TimeTracking;

const getDurationString = (
  startTime: Date,
  endTime?: Date | null,
  showSeconds = false
) => {
  const diff = dayjs.utc(endTime).diff(startTime);
  const duration = dayjs.duration(diff);

  const hours = duration.get("hours");
  const minutes = duration.get("minutes");
  const seconds = duration.get("seconds");

  const durationString = [
    hours ? `${hours}h` : "",
    minutes ? `${minutes}min` : "",
    showSeconds ? `${seconds}s` : "",
  ].join(" ");

  const days = Math.floor(duration.asDays());

  return days > 0
    ? `${durationString} +${days} ${days > 1 ? "Tage" : "Tag"}`
    : durationString;
};
