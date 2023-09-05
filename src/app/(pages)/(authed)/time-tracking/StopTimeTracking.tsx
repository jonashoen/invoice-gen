import React from "react";
import Button from "@/components/Button";
import Form from "@/components/Form";
import TextArea from "@/components/TextArea";
import useApiMutation from "@/hooks/useApiMutation";
import { StopTimeTrackRequest } from "@/interfaces/requests";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import { useState } from "react";
import Info from "@/components/Info";

interface Props {
  timeTrackId: number;
}

const StopTimeTracking = React.forwardRef<number, Props>(
  ({ timeTrackId }, ref) => {
    const hideModal = useModalStore((state) => state.hide);

    const stopTimeTrackingMutation = useApiMutation<StopTimeTrackRequest>({
      route: Api.StopTimeTracking,
      invalidates: [Api.TimeTracking, Api.RunningTimeTrack],
      onSuccess: () => {
        hideModal();
        clearInterval((ref as React.MutableRefObject<number | null>).current!);
      },
      onError: () => {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      },
    });

    const [error, setError] = useState("");
    const [description, setDescription] = useState("");

    const stopTimeTracking = () => {
      stopTimeTrackingMutation.mutate({
        timeTrackId,
        description,
      });
    };

    return (
      <Form onSubmit={stopTimeTracking}>
        {error && (
          <Info severity="error" className="mt-4">
            {error}
          </Info>
        )}

        <TextArea
          label="Beschreibung"
          value={description}
          setValue={setDescription}
          required
          className="h-[200px]"
        />

        <div className="flex justify-end mt-10">
          <Button
            className="bg-ice"
            type="submit"
            disabled={!description}
            loading={stopTimeTrackingMutation.isLoading}
          >
            Stoppen
          </Button>
        </div>
      </Form>
    );
  }
);

export default StopTimeTracking;
