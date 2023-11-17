"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Select from "@/components/Select";
import TextArea from "@/components/TextArea";
import TextField from "@/components/TextField";
import numberToCurrencyString from "@/helper/numberToCurrencyString";
import useApi from "@/hooks/useApi";
import Api from "@/routes/Api";
import {
  Customer,
  InvoicePosition,
  InvoicePositionUnit,
  Project,
} from "@prisma/client";
import { useRef, useState } from "react";

import t from "@/i18n/t";
import useApiMutation from "@/hooks/useApiMutation";
import {
  AddInvoiceRequest,
  DeleteInvoiceRequest,
  EditInvoiceRequest,
} from "@/interfaces/requests/invoice";
import useModalStore from "@/store/modalStore";
import Info from "@/components/Info";
import Paper from "@/components/Paper";
import { GetTimeTrackedSinceLastInvoice } from "@/interfaces/requests";

interface Props {
  id?: number;
  oldProjectId?: string;
  oldPositions?: (InvoicePosition & { deleted?: boolean })[];
}

const AddInvoice: React.FC<Props> = ({
  id,
  oldProjectId = "",
  oldPositions = [],
}) => {
  const hideModal = useModalStore((state) => state.hide);

  const { data: projects, isFetching: projectsFetching } = useApi<
    (Project & { customer: Customer })[]
  >({
    route: Api.Projects,
    initialData: [],
  });

  const priceRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");

  const addInvoiceMutation = useApiMutation<AddInvoiceRequest>({
    route: Api.AddInvoice,
    invalidates: [Api.Invoices],
    onSuccess: hideModal,
    onError: () => {
      setError(
        "Beim Anlegen der Rechnung ist ein Fehler aufgetreten, bitte nochmal versuchen."
      );
    },
  });

  const editInvoiceMutation = useApiMutation<EditInvoiceRequest>({
    route: Api.EditInvoice,
    invalidates: [Api.Invoices],
    onSuccess: hideModal,
    onError: () => {
      setError(
        "Beim Bearbeiten der Rechnung ist ein Fehler aufgetreten, bitte nochmal versuchen."
      );
    },
  });

  const deleteInvoiceMutation = useApiMutation<DeleteInvoiceRequest>({
    route: Api.DeleteInvoice,
    invalidates: [Api.Invoices],
    onSuccess: hideModal,
    onError: () => {
      setError(
        "Beim Löschen der Rechnung ist ein Fehler aufgetreten, bitte nochmal versuchen."
      );
    },
  });

  const getTimeSinceLastInvoiceMutation = useApiMutation<
    GetTimeTrackedSinceLastInvoice,
    number
  >({
    route: Api.TimeSinceLastInvoice,
    onSuccess: (hours) => {
      setDescription("");
      setPrice("");
      setAmount(hours.toString());
      setUnit("hours");
      priceRef.current?.focus();

      console.log(priceRef.current);
    },
    onError: () => {
      setError(
        "Beim Löschen der Rechnung ist ein Fehler aufgetreten, bitte nochmal versuchen."
      );
    },
  });

  const [projectId, setProjectId] = useState(oldProjectId);
  const [positions, setPositions] =
    useState<(InvoicePosition & { deleted?: boolean; added?: boolean })[]>(
      oldPositions
    );

  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState<InvoicePositionUnit>("hours");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const addPosition = () => {
    setPositions((oldPositions) => [
      ...oldPositions,
      {
        amount: parseFloat(amount),
        unit,
        description,
        price: parseFloat(price),
        id: -1,
        invoiceId: -1,
        added: !!id,
      },
    ]);

    setAmount("");
    setUnit("hours");
    setPrice("");
    setDescription("");
  };

  const deletePosition = (index: number) => {
    setPositions((oldPositions) =>
      oldPositions.map((position, i) => ({
        ...position,
        deleted: position.deleted || i === index,
      }))
    );
  };

  const unDeletePosition = (index: number) => {
    setPositions((oldPositions) =>
      oldPositions.map((position, i) => ({
        ...position,
        deleted: position.deleted && i !== index,
      }))
    );
  };

  const addInvoice = () => {
    setError("");

    addInvoiceMutation.mutate({
      projectId: parseInt(projectId),
      positions: positions
        .filter((position) => !position.deleted)
        .map((position) => ({
          amount: position.amount,
          unit: position.unit,
          description: position.description,
          price: position.price,
        })),
    });
  };

  const editInvoice = () => {
    if (!id) return;

    setError("");

    editInvoiceMutation.mutate({
      id,
      projectId: parseInt(projectId),
      addedPositions: positions
        .filter((position) => position.added && !position.deleted)
        .map((position) => ({
          id: position.id,
          amount: position.amount,
          unit: position.unit,
          description: position.description,
          price: position.price,
        })),
      updatedPositions: positions
        .filter((position) => !position.deleted && !position.added)
        .map((position) => ({
          id: position.id,
          amount: position.amount,
          unit: position.unit,
          description: position.description,
          price: position.price,
        })),
      deletedPositions: positions
        .filter((position) => position.deleted && !position.added)
        .map((position) => position.id),
    });
  };

  const deleteInvoice = () => {
    if (!id) return;

    setError("");

    deleteInvoiceMutation.mutate({
      id,
    });
  };

  const addPositionDiabled = !amount || !unit || !price || !description;

  const addDisabled =
    positions.filter((position) => !position.deleted).length === 0 ||
    positions.some(
      (position) =>
        !position.amount ||
        !position.unit ||
        !position.description ||
        !position.price
    );

  const editDisabled =
    addDisabled ||
    positions.every((position) => {
      if (position.deleted) {
        return position.added;
      }

      const oldPosition = oldPositions.find((p) => p.id === position.id);

      if (!oldPosition) {
        return false;
      }

      return (
        position.amount === oldPosition.amount &&
        position.unit === oldPosition.unit &&
        position.description === oldPosition.description &&
        position.price === oldPosition.price
      );
    });

  const getTimeSinceLastInvoice = () => {
    if (!projectId) {
      return;
    }

    setError("");

    getTimeSinceLastInvoiceMutation.mutate({ projectId: parseInt(projectId) });
  };

  return (
    <Form className="gap-5" onSubmit={id ? editInvoice : addInvoice}>
      {error && (
        <Info severity="error" className="mt-4">
          {error}
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

      {!id &&
        positions.filter((position) => position.unit === "hours").length ===
          0 && (
          <p
            className={[
              "text-purple underline",
              projectId ? "cursor-pointer" : "cursor-not-allowed opacity-75",
            ].join(" ")}
            title="Es wird automatisch die Arbeitszeit, seit der letzten Rechnungserstellung, für dieses Projekt berechnet."
            onClick={getTimeSinceLastInvoice}
          >
            <span>Arbeitszeit aus Zeiterfassung übernehmen [?]</span>
          </p>
        )}

      <p>Positionen:</p>
      {positions.length !== 0 && (
        <table>
          <thead className="block border-black border-b mb-4 pb-2">
            <tr className="flex gap-2">
              <td className="flex-[2]">Position</td>
              <td className="flex-[2]">Anzahl</td>
              <td className="flex-[2]">Einheit</td>
              <td className="flex-[6]">Beschreibung</td>
              <td className="flex-[3] text-right">Einzelpreis in Euro</td>
              <td className="flex-[4] text-right">Gesamtpreis</td>
              <td className="flex-[1]" />
            </tr>
          </thead>
          <tbody className="flex flex-col gap-4">
            {positions.map((position, i) => (
              <tr
                key={i}
                className={[
                  "flex gap-2 border-b pb-4 items-center relative",
                  i + 1 !== positions.length
                    ? "border-gray-300"
                    : "border-black",
                  position.deleted && "text-gray-500",
                ].join(" ")}
              >
                <td className="flex-[2]">{i + 1}</td>
                <td className="flex-[2]">
                  <TextField
                    value={position.amount}
                    onChange={(e) =>
                      setPositions((positions) =>
                        positions.map((oldPosition, ii) =>
                          i === ii
                            ? {
                                ...oldPosition,
                                amount: parseFloat(e.target.value),
                              }
                            : oldPosition
                        )
                      )
                    }
                    disabled={position.deleted}
                    required={!position.deleted}
                    type="number"
                  />
                </td>
                <td className="flex-[2]">
                  <Select
                    value={position.unit}
                    onChange={(e) =>
                      setPositions((positions) =>
                        positions.map((oldPosition, ii) =>
                          i === ii
                            ? {
                                ...oldPosition,
                                unit: e.target.value as InvoicePositionUnit,
                              }
                            : oldPosition
                        )
                      )
                    }
                    disabled={position.deleted}
                    required={!position.deleted}
                    options={Object.values(InvoicePositionUnit).map((unit) => ({
                      value: unit,
                      text: t(unit),
                    }))}
                  />
                </td>
                <td className="flex-[6] break-words">
                  <TextField
                    value={position.description}
                    onChange={(e) =>
                      setPositions((positions) =>
                        positions.map((oldPosition, ii) =>
                          i === ii
                            ? {
                                ...oldPosition,
                                description: e.target.value,
                              }
                            : oldPosition
                        )
                      )
                    }
                    disabled={position.deleted}
                    required={!position.deleted}
                  />
                </td>
                <td className="flex-[3] text-right">
                  <TextField
                    value={position.price}
                    onChange={(e) =>
                      setPositions((positions) =>
                        positions.map((oldPosition, ii) =>
                          i === ii
                            ? {
                                ...oldPosition,
                                price: parseFloat(e.target.value),
                              }
                            : oldPosition
                        )
                      )
                    }
                    disabled={position.deleted}
                    required={!position.deleted}
                    type="number"
                  />
                </td>
                <td className="flex-[4] text-right">
                  {!isNaN(position.amount) &&
                    !isNaN(position.price) &&
                    numberToCurrencyString(position.amount * position.price)}
                </td>
                <td className="flex flex-[1] justify-end items-center">
                  <Button
                    className={[
                      "!w-[48px] h-[48px] transition-colors",
                      position.deleted ? "bg-green" : "bg-red-600",
                      position.deleted ? "text-black" : "text-white",
                    ].join(" ")}
                    onClick={() =>
                      position.deleted ? unDeletePosition(i) : deletePosition(i)
                    }
                    title="Löschen"
                    type="button"
                  >
                    {position.deleted ? "+" : "x"}
                  </Button>
                </td>
                {position.deleted && (
                  <td className="transition-opacity absolute left-0 bg-gray-500 w-[calc(100%-60px)]" />
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="flex gap-4">
        <TextField
          value={amount}
          setValue={setAmount}
          label="Anzahl"
          required={positions.length === 0}
          type="number"
        />

        <Select
          value={unit}
          onChange={(e) => setUnit(e.target.value as InvoicePositionUnit)}
          options={Object.values(InvoicePositionUnit).map((unit) => ({
            value: unit,
            text: t(unit),
          }))}
          label="Einheit"
          required={positions.length === 0}
        />

        <TextField
          value={price}
          setValue={setPrice}
          label="Preis in Euro"
          required={positions.length === 0}
          type="number"
          step={0.01}
          ref={priceRef}
        />
      </div>

      <TextArea
        value={description}
        setValue={setDescription}
        label="Beschreibung"
        required={positions.length === 0}
        className="h-32"
      />

      <div className="flex justify-end" onClick={addPosition}>
        <Button type="button" disabled={addPositionDiabled}>
          Position hinzufügen
        </Button>
      </div>

      <div
        className={["flex mt-10", id ? "justify-between" : "justify-end"].join(
          " "
        )}
      >
        {id && (
          <Button
            type="button"
            className="bg-red-600 text-white"
            onClick={deleteInvoice}
            loading={
              addInvoiceMutation.isLoading ||
              editInvoiceMutation.isLoading ||
              deleteInvoiceMutation.isLoading
            }
          >
            Löschen
          </Button>
        )}
        <Button
          className="bg-ice"
          disabled={id ? editDisabled : addDisabled}
          type="submit"
          loading={
            addInvoiceMutation.isLoading ||
            editInvoiceMutation.isLoading ||
            deleteInvoiceMutation.isLoading
          }
        >
          {id ? "Speichern" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
};

export default AddInvoice;
