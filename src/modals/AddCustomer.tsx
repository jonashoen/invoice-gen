"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Info from "@/components/Info";
import TextField from "@/components/TextField";
import useApiMutation from "@/hooks/useApiMutation";
import {
  AddCustomerRequest,
  DeleteCustomerRequest,
  EditCustomerRequest,
} from "@/interfaces/requests/customer";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import StatusCodes from "http-status-codes";
import { useState } from "react";

interface Props {
  id?: number;
  hasProjects?: boolean;
  oldName?: string;
  oldNumber?: string;
  oldZipCode?: string;
  oldCity?: string;
  oldStreet?: string;
  oldHouseNumber?: string;
}

const AddCustomer: React.FC<Props> = ({
  id,
  hasProjects,
  oldName = "",
  oldNumber = "",
  oldZipCode = "",
  oldCity = "",
  oldStreet = "",
  oldHouseNumber = "",
}) => {
  const hideModal = useModalStore((state) => state.hide);

  const [error, setError] = useState<string | null>(null);

  const addCustomerMutation = useApiMutation<AddCustomerRequest>({
    route: Api.AddCustomer,
    invalidates: [Api.Customers],
    onSuccess: hideModal,
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setError("Name oder Kundennummer schon vergeben.");
      } else {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const editCustomerMutation = useApiMutation<EditCustomerRequest>({
    route: Api.EditCustomer,
    invalidates: [Api.Customers],
    onSuccess: hideModal,
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setError("Name oder Kundennummer schon vergeben.");
      } else {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const deleteCustomerMutation = useApiMutation<DeleteCustomerRequest>({
    route: Api.DeleteCustomer,
    invalidates: [Api.Customers],
    onSuccess: hideModal,
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const [name, setName] = useState(oldName);
  const [number, setNumber] = useState(oldNumber);
  const [zipCode, setZipCode] = useState(oldZipCode);
  const [city, setCity] = useState(oldCity);
  const [street, setStreet] = useState(oldStreet);
  const [houseNumber, setHouseNumber] = useState(oldHouseNumber);

  const addCustomer = () => {
    setError(null);

    addCustomerMutation.mutate({
      name,
      number,
      zipCode,
      city,
      street,
      houseNumber,
    });
  };

  const editCustomer = () => {
    if (!id) return;

    setError(null);

    editCustomerMutation.mutate({
      id,
      name,
      number,
      zipCode,
      city,
      street,
      houseNumber,
    });
  };

  const deleteCustomer = () => {
    if (!id) return;

    setError(null);

    deleteCustomerMutation.mutate({
      id,
    });
  };

  const buttonEnabledEdit =
    oldName !== name ||
    oldNumber !== number ||
    oldZipCode !== zipCode ||
    oldCity !== city ||
    oldStreet !== street ||
    oldHouseNumber !== houseNumber;

  return (
    <Form className="gap-5" onSubmit={id ? editCustomer : addCustomer}>
      {error && (
        <Info severity="error" className="mt-4">
          {error}
        </Info>
      )}

      <div className="flex gap-4">
        <TextField
          label="Name"
          value={name}
          setValue={setName}
          required
          name="name"
        />
        <TextField
          label="Kundennummer"
          value={number}
          setValue={setNumber}
          required
          name="number"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <TextField
          label="PLZ"
          required
          value={zipCode}
          setValue={setZipCode}
          name="zipcode"
          className="min-w-[100px]"
        />
        <TextField
          label="Stadt"
          required
          value={city}
          setValue={setCity}
          name="city"
          className="min-w-[300px]"
        />
        <TextField
          label="Straße"
          required
          value={street}
          setValue={setStreet}
          name="street"
          className="min-w-[200px]"
        />
        <TextField
          label="Hausnummer"
          required
          value={houseNumber}
          setValue={setHouseNumber}
          name="housenumber"
          className="min-w-[100px]"
        />
      </div>
      <div
        className={[
          "flex justify-end mt-10",
          hasProjects === false ? "justify-between" : "justify-end",
        ].join(" ")}
      >
        {hasProjects === false && (
          <Button
            type="button"
            className="bg-red-600 text-white"
            onClick={deleteCustomer}
            loading={
              addCustomerMutation.isLoading ||
              editCustomerMutation.isLoading ||
              deleteCustomerMutation.isLoading
            }
          >
            Löschen
          </Button>
        )}
        <Button
          type="submit"
          className="bg-ice"
          loading={
            addCustomerMutation.isLoading ||
            editCustomerMutation.isLoading ||
            deleteCustomerMutation.isLoading
          }
          disabled={id ? !buttonEnabledEdit : false}
        >
          {id ? "Bearbeiten" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
};

export default AddCustomer;
