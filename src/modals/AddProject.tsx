"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Info from "@/components/Info";
import Select from "@/components/Select";
import TextField from "@/components/TextField";
import useApi from "@/hooks/useApi";
import useApiMutation from "@/hooks/useApiMutation";
import t from "@/i18n/t";
import {
  AddProjectRequest,
  DeleteProjectRequest,
  EditProjectRequest,
} from "@/interfaces/requests/project";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import { Customer, PaymentDueUnit } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";

interface Props {
  id?: number;
  hasInvoices?: boolean;
  oldName?: string;
  oldPaymentDue?: string;
  oldPaymentDueUnit?: PaymentDueUnit;
  oldCustomerId?: string;
}

const AddProject: React.FC<Props> = ({
  id,
  hasInvoices,
  oldName = "",
  oldPaymentDue = "",
  oldPaymentDueUnit = "days",
  oldCustomerId = "",
}) => {
  const hideModal = useModalStore((state) => state.hide);

  const { data: customers, isFetching: customersFetching } = useApi<Customer[]>(
    {
      route: Api.Customers,
      initialData: [],
    }
  );

  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(oldName);
  const [paymentDue, setPaymentDue] = useState(oldPaymentDue);
  const [paymentDueUnit, setPaymentDueUnit] =
    useState<PaymentDueUnit>(oldPaymentDueUnit);
  const [customerId, setCustomerId] = useState(oldCustomerId);

  const addProjectMutation = useApiMutation<AddProjectRequest>({
    route: Api.AddProject,
    invalidates: [Api.Projects],
    onSuccess: hideModal,
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setError("Der Projektname ist bei diesem Kunden schon vergeben.");
      } else {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const editProjectMutation = useApiMutation<EditProjectRequest>({
    route: Api.EditProject,
    invalidates: [Api.Projects],
    onSuccess: hideModal,
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setError("Der Projektname ist bei diesem Kunden schon vergeben.");
      } else {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const deleteProjectMutation = useApiMutation<DeleteProjectRequest>({
    route: Api.DeleteProject,
    invalidates: [Api.Projects],
    onSuccess: hideModal,
    onError: () => {
      setError(
        "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
      );
    },
  });

  const addProject = () => {
    setError(null);

    addProjectMutation.mutate({
      name,
      paymentDue: parseInt(paymentDue),
      paymentDueUnit,
      customerId: parseInt(customerId),
    });
  };

  const editProject = () => {
    if (!id) return;

    setError(null);

    editProjectMutation.mutate({
      id,
      name,
      paymentDue: parseInt(paymentDue),
      paymentDueUnit,
      customerId: parseInt(customerId),
    });
  };

  const deleteProject = () => {
    if (!id) return;

    setError(null);

    deleteProjectMutation.mutate({
      id,
    });
  };

  const buttonEnabledEdit =
    oldName !== name ||
    oldName !== name ||
    oldPaymentDue !== paymentDue ||
    oldPaymentDueUnit !== paymentDueUnit ||
    oldCustomerId !== customerId;

  return (
    <Form className="gap-5" onSubmit={id ? editProject : addProject}>
      {error && (
        <Info severity="error" className="mt-4">
          {error}
        </Info>
      )}

      <Select
        label="Kunde"
        required
        value={customerId}
        setValue={setCustomerId}
        name="customer"
        loading={customersFetching}
        options={customers.map((customer) => ({
          value: customer.id,
          text: customer.name,
        }))}
      />

      <TextField
        label="Name"
        value={name}
        setValue={setName}
        required
        name="projectName"
      />

      <div className="flex flex-wrap gap-4">
        <TextField
          label="Zahlungsfrist"
          required
          value={paymentDue}
          setValue={setPaymentDue}
          name="paymentDue"
          type="number"
          className="min-w-[250px]"
        />

        <Select
          label="Zahlungsfrist-Einheit"
          required
          value={paymentDueUnit}
          onChange={(e) => setPaymentDueUnit(e.target.value as PaymentDueUnit)}
          name="paymentDueUnit"
          options={Object.values(PaymentDueUnit).map((unit) => ({
            text: t(unit),
            value: unit,
          }))}
          className="min-w-[250px]"
        />
      </div>

      <div
        className={[
          "flex justify-end mt-10",
          hasInvoices === false ? "justify-between" : "justify-end",
        ].join(" ")}
      >
        {hasInvoices === false && (
          <Button
            type="button"
            className="bg-red-600 text-white"
            onClick={deleteProject}
            loading={
              addProjectMutation.isLoading ||
              editProjectMutation.isLoading ||
              deleteProjectMutation.isLoading
            }
          >
            Löschen
          </Button>
        )}
        <Button
          type="submit"
          className="bg-ice"
          loading={
            addProjectMutation.isLoading ||
            editProjectMutation.isLoading ||
            deleteProjectMutation.isLoading
          }
          disabled={id ? !buttonEnabledEdit : false}
        >
          {id ? "Bearbeiten" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
};

export default AddProject;
