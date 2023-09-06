"use client";

import Button from "@/components/Button";
import EditableList from "@/components/EditableActivitiesList";
import Form from "@/components/Form";
import Info from "@/components/Info";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import TextField from "@/components/TextField";
import dateToDateString from "@/helper/dateToDateString";
import useApi from "@/hooks/useApi";
import useApiMutation from "@/hooks/useApiMutation";
import {
  DeleteTimeTrackRequest,
  EditTimeTrackRequest,
  StartTimeTrackRequest,
} from "@/interfaces/requests";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import { Customer, Project, TimeTrackActivity } from "@prisma/client";
import dayjs from "dayjs";
import { StatusCodes } from "http-status-codes";
import { boolean } from "joi";
import { useState } from "react";

interface Props {
  timeTrackId?: number;
  oldProjectId?: number;
  oldStartTime?: Date;
  oldEndTime?: Date;
  oldActivities?: TimeTrackActivity[];
}

const AddTimeTracking: React.FC<Props> = ({
  timeTrackId,
  oldProjectId = "",
  oldStartTime,
  oldEndTime,
  oldActivities = [],
}) => {
  const hideModal = useModalStore((state) => state.hide);

  const { data: projects, isFetching: projectsFetching } = useApi<
    (Project & { customer: Customer })[]
  >({
    route: Api.Projects,
    initialData: [],
  });

  const startTimeTrackingMutation = useApiMutation<StartTimeTrackRequest>({
    route: Api.StartTimeTracking,
    onSuccess: hideModal,
    onError: () => {
      setError(
        "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
      );
    },
    invalidates: [Api.TimeTracking, Api.RunningTimeTrack],
  });

  const editTimeTrackingMutation = useApiMutation<EditTimeTrackRequest>({
    route: Api.EditTimeTracking,
    onSuccess: hideModal,
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setError("Die Startzeit muss vor der Endzeit liegen!");
      } else {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
    invalidates: [Api.TimeTracking],
  });

  const deleteTimeTrackingMutation = useApiMutation<DeleteTimeTrackRequest>({
    route: Api.DeleteTimeTracking,
    onSuccess: hideModal,
    onError: () => {
      setError(
        "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
      );
    },
    invalidates: [Api.TimeTracking],
  });

  const [error, setError] = useState("");
  const [projectId, setProjectId] = useState(oldProjectId.toString());
  const [startTime, setStartTime] = useState(
    dateToLocalIsoString(oldStartTime)
  );
  const [endTime, setEndTime] = useState(dateToLocalIsoString(oldEndTime));
  const [activities, setActivities] =
    useState<(TimeTrackActivity & { added?: boolean; deleted?: boolean })[]>(
      oldActivities
    );

  const startTimeTracking = () => {
    setError("");

    startTimeTrackingMutation.mutate({ projectId: parseInt(projectId) });
  };

  const editTimeTracking = () => {
    if (!timeTrackId) {
      return;
    }

    setError("");

    editTimeTrackingMutation.mutate({
      timeTrackId,
      projectId: parseInt(projectId),
      startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      addedActivities: activities
        .filter((a) => a.added && !a.deleted)
        .map((a) => ({
          description: a.description,
        })),
      updatedActivities: activities
        .filter((a) => !a.added && !a.deleted)
        .map((a) => ({
          id: a.id,
          description: a.description,
        })),
      deletedActivities: activities
        .filter((a) => a.deleted && !a.added)
        .map((a) => a.id),
    });
  };

  const deleteTimeTracking = () => {
    if (!timeTrackId) {
      return;
    }

    setError("");

    deleteTimeTrackingMutation.mutate({ timeTrackId });
  };

  const startTrackingDisabled = !projectId;

  const editTrackingDisabled =
    activities.filter((a) => !a.deleted).length === 0 ||
    (dateToLocalIsoString(new Date(startTime)) ===
      dateToLocalIsoString(oldStartTime) &&
      dateToLocalIsoString(new Date(endTime)) ===
        dateToLocalIsoString(oldEndTime) &&
      activities.every((activity) => {
        if (activity.deleted) {
          return activity.added;
        }

        const oldActivity = oldActivities.find((a) => a.id === activity.id);

        if (!oldActivity) {
          return false;
        }

        return activity.description === oldActivity.description;
      }));

  const submitDisabled = timeTrackId
    ? editTrackingDisabled
    : startTrackingDisabled;

  return (
    <Form
      className="gap-5"
      onSubmit={timeTrackId ? editTimeTracking : startTimeTracking}
    >
      {error && (
        <Info severity="error" className="mt-4">
          {error}
        </Info>
      )}

      <Select
        value={projectId}
        setValue={setProjectId}
        loading={projectsFetching}
        options={projects.map((project) => ({
          value: project.id,
          text: `${project.name} (${project.customer.name})`,
        }))}
        label="Projekt"
      />

      {timeTrackId && (
        <>
          <TextField
            label="Startzeit"
            value={startTime}
            setValue={setStartTime}
            type="datetime-local"
            max={endTime}
          />

          <TextField
            label="Endzeit"
            value={endTime}
            setValue={setEndTime}
            type="datetime-local"
            min={startTime}
          />

          <EditableList
            label="Tätigkeiten"
            value={activities}
            setValue={setActivities}
          />
        </>
      )}

      <div
        className={[
          "flex mt-10",
          timeTrackId ? "justify-between" : "justify-end",
        ].join(" ")}
      >
        {timeTrackId && (
          <Button
            type="button"
            className="bg-red-600 text-white"
            loading={
              startTimeTrackingMutation.isLoading ||
              editTimeTrackingMutation.isLoading ||
              deleteTimeTrackingMutation.isLoading
            }
            onClick={deleteTimeTracking}
          >
            Löschen
          </Button>
        )}
        <Button
          type="submit"
          className="bg-ice"
          loading={
            projectsFetching ||
            startTimeTrackingMutation.isLoading ||
            editTimeTrackingMutation.isLoading ||
            deleteTimeTrackingMutation.isLoading
          }
          disabled={submitDisabled}
        >
          {timeTrackId ? "Speichern" : "Starten"}
        </Button>
      </div>
    </Form>
  );
};

export default AddTimeTracking;

const dateToLocalIsoString = (date?: Date) =>
  date ? dayjs(date).format("YYYY-MM-DD[T]HH:mm") : "";
