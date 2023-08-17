import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Form from "@/components/Form";
import Paper from "@/components/Paper";
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
import { calculateSizeAdjustValues } from "next/dist/server/font-utils";
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

  const buttonDisabled =
    !name || !number || !zipCode || !city || !street || !houseNumber;

  const buttonEnabledEdit =
    !buttonDisabled &&
    (oldName !== name ||
      oldNumber !== number ||
      oldZipCode !== zipCode ||
      oldCity !== city ||
      oldStreet !== street ||
      oldHouseNumber !== houseNumber);

  return (
    <Form
      className="flex flex-col gap-5"
      onSubmit={id ? editCustomer : addCustomer}
    >
      {error && (
        <Chip className="bg-red-600 text-white text-center">{error}</Chip>
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

      <div className="flex gap-4">
        <TextField
          label="PLZ"
          required
          value={zipCode}
          setValue={setZipCode}
          name="zipcode"
        />
        <TextField
          label="Stadt"
          required
          value={city}
          setValue={setCity}
          name="city"
        />
        <TextField
          label="Straße"
          required
          value={street}
          setValue={setStreet}
          name="street"
        />
        <TextField
          label="Hausnummer"
          required
          value={houseNumber}
          setValue={setHouseNumber}
          name="housenumber"
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
          disabled={id ? !buttonEnabledEdit : buttonDisabled}
        >
          {id ? "Bearbeiten" : "Anlegen"}
        </Button>
      </div>
    </Form>
  );
};

export default AddCustomer;
