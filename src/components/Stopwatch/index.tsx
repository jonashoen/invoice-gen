"use client";

import getDurationString from "@/helper/getDurationString";
import { useEffect, useRef, useState } from "react";

interface Props {
  startTime: Date;
}

const Stopwatch: React.FC<Props> = ({ startTime }) => {
  const intervalRef = useRef<number | null>(null);

  const [runningTimeTrackDuration, setRunningTimeTrackDuration] = useState("");

  useEffect(() => {
    const updateTime = () => {
      console.log("update");

      setRunningTimeTrackDuration(
        getDurationString(startTime, undefined, true)
      );
    };

    updateTime();

    intervalRef.current = setInterval(updateTime, 1000) as any as number;

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return runningTimeTrackDuration;
};

export default Stopwatch;
