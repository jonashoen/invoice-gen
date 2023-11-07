"use client";

import Button from "@/components/Button";
import useApiMutation from "@/hooks/useApiMutation";
import { StartTimeTrackRequest } from "@/interfaces/requests";
import Api from "@/routes/Api";
import { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  projectId: number;
}

const RestartTimeTrackingButton: React.FC<Props> = ({
  projectId,
  ...props
}) => {
  const startTracking = useApiMutation<StartTimeTrackRequest>({
    route: Api.StartTimeTracking,
    invalidates: [Api.RunningTimeTrack],
  });

  return (
    <Button
      className="!w-12 !font-black"
      title="Zeiterfassung für dieses Projekt starten"
      onClick={() => startTracking.mutate({ projectId })}
      {...props}
    >
      {">"}
    </Button>
  );
};

export default RestartTimeTrackingButton;
