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
  const [newItem, setNewItem] = useState("");

  const addedActivities = activities.filter((activity) => !activity.deleted);

  const stopTimeTracking = () => {
    const allActivities = newItem
      ? [
          ...addedActivities,
          {
            description: newItem,
            added: true,
            id: -1,
            timeTrackId: -1,
          },
        ]
      : addedActivities;

    stopTimeTrackingMutation.mutate({
      activities: allActivities.map((activity) => activity.description),
    });
  };
  console.log(activities.length === 0);
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
          newItem={newItem}
          setNewItem={setNewItem}
          required={activities.length === 0}
        />

        <div className="flex justify-end mt-10">
          <Button
            className="bg-ice"
            type="submit"
            loading={stopTimeTrackingMutation.isLoading}
          >
            Stoppen
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default StopTimeTracking;
