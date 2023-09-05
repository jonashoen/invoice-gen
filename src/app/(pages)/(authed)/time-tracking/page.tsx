"use client";

import Button from "@/components/Button";
import Header from "@/components/Header";
import useModalStore from "@/store/modalStore";
import AddTimeTracking from "./AddTimeTracking";
import useApi from "@/hooks/useApi";
import { Customer, Project, TimeTrack } from "@prisma/client";
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

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.locale("de");

const TimeTracking = () => {
  const showModal = useModalStore((state) => state.show);

  const intervalRef = useRef<number | null>(null);

  const { data: timeTracks, isFetching: timeTracksFetching } = useApi<
    (TimeTrack & { project: Project & { customer: Customer } })[]
  >({
    route: Api.TimeTracking,
  });

  const { data: runningTimeTrack, isFetching: runningTimeTrackFetching } =
    useApi<(TimeTrack & { project: Project & { customer: Customer } }) | null>({
      route: Api.RunningTimeTrack,
      onSuccess: (data) => {
        if (data) {
          setRunningTimeTrackDuration(getDurationString(data.startTime));

          intervalRef.current = setInterval(() => {
            console.log("test");
            setRunningTimeTrackDuration(getDurationString(data.startTime));
          }, 1000) as any as number;
        }
      },
    });

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
            <Paper className="!bg-purple text-white">
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
                        content: (
                          <StopTimeTracking
                            ref={intervalRef}
                            timeTrackId={runningTimeTrack.id}
                          />
                        ),
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

        <div className="flex flex-col gap-4">
          {!timeTracksFetching ? (
            timeTracks.map((timeTrack) => (
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
                    <Button>Bearbeiten</Button>
                  </div>
                </div>

                <p className="mt-2">{timeTrack.description}</p>
              </Paper>
            ))
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </main>
  );
};

export default TimeTracking;

const getDurationString = (startTime: Date, endTime?: Date | null) => {
  const diff = dayjs.utc(endTime).diff(startTime);
  const duration = dayjs.duration(diff);
  const durationString = duration.format("HH:mm:ss");

  const days = duration.get("days");

  return days ? `${durationString} + ${days} Tage` : durationString;
};
