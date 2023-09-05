"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Info from "@/components/Info";
import Select from "@/components/Select";
import useApi from "@/hooks/useApi";
import useApiMutation from "@/hooks/useApiMutation";
import {
  DeleteTimeTrackRequest,
  EditTimeTrackRequest,
  StartTimeTrackRequest,
} from "@/interfaces/requests";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import { Customer, Project } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";

interface Props {
  timeTrackId?: number;
}

const AddTimeTracking: React.FC<Props> = ({ timeTrackId }) => {
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
        setError("Das Startdatum muss vor dem Enddatum liegen!");
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
  const [projectId, setProjectId] = useState("");

  const startTimeTracking = () => {
    setError("");

    startTimeTrackingMutation.mutate({ projectId: parseInt(projectId) });
  };

  const editTimeTracking = () => {
    if (!timeTrackId) {
      return;
    }

    setError("");

    editTimeTrackingMutation.mutate({ timeTrackId });
  };

  const deleteTimeTracking = () => {
    if (!timeTrackId) {
      return;
    }

    setError("");

    deleteTimeTrackingMutation.mutate({ timeTrackId });
  };

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
            loading={projectsFetching}
            onClick={deleteTimeTracking}
          >
            Löschen
          </Button>
        )}
        <Button
          type="submit"
          className="bg-ice"
          loading={projectsFetching}
          disabled={!projectId}
        >
          Starten
        </Button>
      </div>
    </Form>
  );
};

export default AddTimeTracking;
