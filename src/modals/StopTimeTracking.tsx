"use client";

import React, { ForwardedRef } from "react";
import Button from "@/components/Button";
import useApiMutation from "@/hooks/useApiMutation";
import { StopTimeTrackRequest } from "@/interfaces/requests";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import { useState } from "react";
import Info from "@/components/Info";
import EditableList from "@/components/EditableActivitiesList";
import { TimeTrackActivity } from "@prisma/client";

const StopTimeTracking = () => {
  const hideModal = useModalStore((state) => state.hide);

  const stopTimeTrackingMutation = useApiMutation<StopTimeTrackRequest>({
    route: Api.StopTimeTracking,
    invalidates: [Api.TimeTracking, Api.RunningTimeTrack],
    onSuccess: () => {
      hideModal();
    },
    onError: () => {
      setError(
        "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
      );
    },
  });

  const [error, setError] = useState("");
  const [activities, setActivities] = useState<TimeTrackActivity[]>([]);

  const stopTimeTracking = () => {
    stopTimeTrackingMutation.mutate({
      activities: activities.map((activity) => activity.description),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <Info severity="error" className="mt-4">
          {error}
        </Info>
      )}

      <EditableList
        label="Tätigkeiten"
        value={activities}
        setValue={setActivities}
      />

      <div className="flex justify-end mt-10">
        <Button
          className="bg-ice"
          type="submit"
          disabled={activities.length === 0}
          loading={stopTimeTrackingMutation.isLoading}
          onClick={stopTimeTracking}
        >
          Stoppen
        </Button>
      </div>
    </div>
  );
};

export default StopTimeTracking;
