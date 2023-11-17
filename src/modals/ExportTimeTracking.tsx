"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Info from "@/components/Info";
import Select from "@/components/Select";
import TextField from "@/components/TextField";
import useApi from "@/hooks/useApi";
import useApiMutation from "@/hooks/useApiMutation";
import { ExportTimeTrackRequest } from "@/interfaces/requests";
import Api from "@/routes/Api";
import { Customer, Project } from "@prisma/client";
import { useState } from "react";
import TimeTrackExportResponse from "@/interfaces/responses/TimeTrackExportResponse";
import dateToDateString from "@/helper/dateToDateString";
import { mkConfig, generateCsv, download as downloadCsv } from "export-to-csv";

const csvConfig = mkConfig({
  columnHeaders: [
    { displayLabel: "Datum", key: "date" },
    { displayLabel: "Stunden", key: "duration" },
    { displayLabel: "Tätigkeiten", key: "activities" },
  ],
  fieldSeparator: ";",
  filename: `Stundenzettel_${dateToDateString()}`,
  decimalSeparator: "locale",
});

const ExportTimeTracking: React.FC = () => {
  const { data: projects, isFetching: projectsFetching } = useApi<
    (Project & { customer: Customer })[]
  >({
    route: Api.Projects,
    initialData: [],
  });

  const [info, setInfo] = useState<{
    severity: "error" | "success" | "warning";
    message: string;
  } | null>(null);

  const getTimeTrackingDataMutation = useApiMutation<
    ExportTimeTrackRequest,
    TimeTrackExportResponse[]
  >({
    route: Api.ExportTimeTracking,
    onSuccess: (timeTracks) => {
      const formattedTimeTracks = timeTracks.map(
        ({ date, duration, activities }) => ({
          date: dateToDateString(date),
          duration: duration.toLocaleString(),
          activities,
        })
      );

      formattedTimeTracks.push({ date: "", duration: "", activities: [] });
      formattedTimeTracks.push({
        date: "Gesamt",
        duration: timeTracks
          .reduce((hoursSum, timeTrack) => hoursSum + timeTrack.duration, 0)
          .toLocaleString(),
        activities: [],
      });

      const csvData = generateCsv(csvConfig)(formattedTimeTracks);

      downloadCsv(csvConfig)(csvData);

      setInfo({
        severity: "success",
        message: "Die Datei wurde heruntergeladen.",
      });
    },
    onError: () => {
      setInfo({
        severity: "error",
        message:
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen.",
      });
    },
  });

  const [projectId, setProjectId] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(() => {
    const date = new Date();

    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-01`;

    return dateString;
  });
  const [endDate, setEndDate] = useState<string>(() => {
    const date = new Date();

    const dateString = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;

    return dateString;
  });

  const getTimeTrackingData = () => {
    setInfo(null);

    getTimeTrackingDataMutation.mutate({
      projectId: parseInt(projectId),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });
  };

  return (
    <Form className="gap-5" onSubmit={getTimeTrackingData}>
      {info && (
        <Info severity={info.severity} className="mt-4">
          {info.message}
        </Info>
      )}

      <Select
        value={projectId}
        setValue={setProjectId}
        loading={projectsFetching}
        options={projects
          .filter((project) => !project.archived)
          .map((project) => ({
            value: project.id,
            text: `${project.name} (${project.customer.name})`,
          }))}
        label="Projekt"
        required
      />

      <TextField
        label="Start"
        value={startDate}
        setValue={setStartDate}
        type="date"
        max={endDate}
        required
      />

      <TextField
        label="Ende"
        value={endDate}
        setValue={setEndDate}
        type="date"
        min={startDate}
        max={new Date().toISOString().split("T")[0]}
        required
      />

      <div className="flex justify-end mt-10">
        <Button
          className="bg-ice"
          type="submit"
          loading={getTimeTrackingDataMutation.isLoading}
        >
          Exportieren
        </Button>
      </div>
    </Form>
  );
};

export default ExportTimeTracking;
