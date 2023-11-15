"use client";

import Button from "@/components/Button";
import useApiMutation from "@/hooks/useApiMutation";
import { StopTimeTrackRequest } from "@/interfaces/requests";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import { useState } from "react";
import Info from "@/components/Info";
import EditableList from "@/components/EditableActivitiesList";
import { TimeTrackActivity } from "@prisma/client";
import Form from "@/components/Form";

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
  const [activities, setActivities] = useState<
    (TimeTrackActivity & { added?: boolean; deleted?: boolean })[]
  >([]);

  const addedActivities = activities.filter((activity) => !activity.deleted);

  const stopTimeTracking = () => {
    stopTimeTrackingMutation.mutate({
      activities: addedActivities.map((activity) => activity.description),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      {error && (
        <Info severity="error" className="mt-4">
          {error}
        </Info>
      )}

      <Form onSubmit={stopTimeTracking}>
        <EditableList
          label="Tätigkeiten"
          value={activities}
          setValue={setActivities}
        />

        <div className="flex justify-end mt-10">
          <Button
            className="bg-ice"
            type="submit"
            loading={stopTimeTrackingMutation.isLoading}
            disabled={addedActivities.length === 0}
          >
            Stoppen
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default StopTimeTracking;
