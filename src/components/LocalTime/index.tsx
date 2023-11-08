"use client";

import React, { HTMLAttributes } from "react";

import dateToTimeString from "@/helper/dateToTimeString";

interface Props extends HTMLAttributes<HTMLParagraphElement> {
  date: Date;
  component?: string;
}

const LocalTime: React.FC<Props> = ({ date, component, ...props }) => {
  const c = component ?? "p";

  return React.createElement(c, props, dateToTimeString(date) + " Uhr");
};

export default LocalTime;
