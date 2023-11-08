"use client";

import React, { Suspense, TimeHTMLAttributes } from "react";

import dateToTimeString from "@/helper/dateToTimeString";
import useHydration from "@/hooks/useHydration";

interface Props extends TimeHTMLAttributes<HTMLTimeElement> {
  date: Date;
}

const LocalTime: React.FC<Props> = ({ date, ...props }) => {
  const hydrated = useHydration();

  return (
    <Suspense key={hydrated ? "local" : "utc"}>
      <time dateTime={new Date(date).toISOString()} {...props}>
        {dateToTimeString(date)} Uhr
        {!hydrated && " (UTC)"}
      </time>
    </Suspense>
  );
};

export default LocalTime;
