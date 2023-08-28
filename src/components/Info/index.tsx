import React, { HTMLAttributes } from "react";
import Paper from "../Paper";

interface Props extends HTMLAttributes<HTMLElement> {
  severity: "success" | "warning" | "error";
}

const SeverityToBackgroundColor = {
  success: "!bg-green",
  warning: "!bg-orange",
  error: "!bg-red-600",
};

const SeverityToTextColor = {
  success: "text-black",
  warning: "text-white",
  error: "text-white",
};

const Info: React.FC<Props> = ({ children, className, severity, ...props }) => (
  <Paper
    className={[
      className,
      `!border-4 text-center ${SeverityToBackgroundColor[severity]} ${SeverityToTextColor[severity]}`,
    ].join(" ")}
    {...props}
  >
    {children}
  </Paper>
);

export default Info;
