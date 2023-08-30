"use client";

import { useState } from "react";

import Form from "@/components/Form";
import Paper from "@/components/Paper";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import useApiMutation from "@/hooks/useApiMutation";
import { RegisterRequest } from "@/interfaces/requests/user";
import Api from "@/routes/Api";
import Link from "next/link";
import Pages from "@/routes/Pages";
import useModalStore from "@/store/modalStore";
import VerifyAccount from "./VerifyAccount";
import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import Info from "@/components/Info";

const Register = () => {
  const showModal = useModalStore((state) => state.show);

  const register = useApiMutation<RegisterRequest, User>({
    route: Api.Register,
    onSuccess: (user) => {
      showModal({
        title: "Account verifizieren",
        content: <VerifyAccount username={username} />,
        cancelable: false,
      });
    },
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setError("Der Nutzername oder die E-Mail ist schon vergeben.");
      } else {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const [error, setError] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeated, setPasswordRepeated] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [street, setStreet] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [bank, setBank] = useState("");
  const [iban, setIban] = useState("");
  const [bic, setBic] = useState("");
  const [taxNumber, setTaxNumber] = useState("");
  const [vatId, setVatId] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");

  const onSubmit = () => {
    register.mutate({
      username,
      password,
      passwordRepeated,
      firstName,
      lastName,
      zipCode,
      city,
      street,
      houseNumber,
      bank,
      iban,
      bic,
      taxNumber,
      vatId,
      telephone,
      email,
    });
  };

  return (
    <Form onSubmit={onSubmit}>
      <Paper className="gap-2 mt-10">
        <div className="flex justify-between items-center">
          <p className="font-bold py-4 text-4xl">Regstrieren</p>
          <p>
            oder{" "}
            <Link className="underline" href={Pages.Login}>
              Einloggen
            </Link>
          </p>
        </div>

        {error && (
          <Info severity="error" className="mt-4">
            {error}
          </Info>
        )}

        <TextField
          name="username"
          value={username}
          setValue={setUsername}
          label="Nutzername"
          required
        />

        <div className="flex justify-between gap-4">
          <TextField
            name="password"
            value={password}
            setValue={setPassword}
            label="Passwort"
            required
            type="password"
          />

          <TextField
            name="password-repeated"
            value={passwordRepeated}
            setValue={setPasswordRepeated}
            label="Passwort wiederholen"
            required
            type="password"
          />
        </div>

        <div className="flex justify-between gap-4">
          <TextField
            name="firstname"
            value={firstName}
            setValue={setFirstName}
            label="Vorname"
            required
          />

          <TextField
            name="lastname"
            value={lastName}
            setValue={setLastName}
            label="Nachname"
            required
          />
        </div>

        <div className="flex justify-between gap-4">
          <TextField
            name="zipcode"
            value={zipCode}
            setValue={setZipCode}
            label="PLZ"
            required
          />

          <TextField
            name="city"
            value={city}
            setValue={setCity}
            label="Stadt"
            required
          />

          <TextField
            name="street"
            value={street}
            setValue={setStreet}
            label="Straße"
            required
          />

          <TextField
            name="housenumber"
            value={houseNumber}
            setValue={setHouseNumber}
            label="Hausnummer"
            required
          />
        </div>

        <div className="flex justify-between gap-4">
          <TextField
            name="bank"
            value={bank}
            setValue={setBank}
            label="Bank"
            required
          />

          <TextField
            name="iban"
            value={iban}
            setValue={setIban}
            label="IBAN"
            required
          />

          <TextField
            name="bic"
            value={bic}
            setValue={setBic}
            label="BIC"
            required
          />
        </div>

        <div className="flex justify-between gap-4">
          <TextField
            name="taxnumber"
            value={taxNumber}
            setValue={setTaxNumber}
            label="Steuernummer"
            required={!vatId}
          />

          <TextField
            name="vatId"
            value={vatId}
            setValue={setVatId}
            label="Umsatzsteuer-Identifikationsnummer"
            required={!taxNumber}
          />
        </div>

        <div className="flex justify-between gap-4">
          <TextField
            name="telephone"
            value={telephone}
            setValue={setTelephone}
            label="Telefonnummer"
            required
            type="tel"
          />

          <TextField
            name="email"
            value={email}
            setValue={setEmail}
            label="E-Mail"
            required
            type="email"
          />
        </div>

        <div className="flex justify-end mt-4 ">
          <Button type="submit" className="bg-ice" loading={register.isLoading}>
            Registrieren
          </Button>
        </div>
      </Paper>
    </Form>
  );
};

export default Register;
