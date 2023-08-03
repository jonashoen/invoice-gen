"use client";

import { useState } from "react";

import Form from "@/components/Form";
import Container from "@/components/Container";
import Paper from "@/components/Paper";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import useApiMutation from "@/hooks/useApiMutation";
import RegisterRequest from "@/interfaces/requests/register";
import Api from "@/routes/Api";

const Register = () => {
  const register = useApiMutation<RegisterRequest, any>({
    route: Api.Register,
  });

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
      zipCode: parseInt(zipCode),
      city,
      street,
      houseNumber: parseInt(houseNumber),
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
    <main className="h-full bg-yellow">
      <Form
        onSubmit={onSubmit}
        className="container mx-auto h-screen flex flex-col justify-center"
      >
        <Container className="bg-green">
          <p className="font-bold py-4 text-6xl flex justify-between">
            <span>invoice-gen</span>
            <span>v0.0.1</span>
          </p>
        </Container>

        <Paper className="gap-2 bg-white mt-10">
          <div className="flex justify-between items-center">
            <p className="font-bold py-4 text-4xl">Regstrieren</p>
            <p>
              oder{" "}
              <a className="underline" href="/login">
                Einloggen
              </a>
            </p>
          </div>

          <TextField
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="text-purple"
            label="Nutzername"
            required
          />

          <TextField
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-purple"
            label="Passwort"
            required
            type="password"
          />

          <TextField
            name="password-repeated"
            value={passwordRepeated}
            onChange={(e) => setPasswordRepeated(e.target.value)}
            className="text-purple"
            label="Passwort wiederholen"
            required
            type="password"
          />

          <div className="flex justify-between gap-4">
            <TextField
              name="firstname"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="text-purple"
              label="Vorname"
              required
            />

            <TextField
              name="lastname"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="text-purple"
              label="Nachname"
              required
            />
          </div>

          <div className="flex justify-between gap-4">
            <TextField
              name="zipcode"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="text-purple"
              label="PLZ"
              required
              type="number"
            />

            <TextField
              name="city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="text-purple"
              label="Stadt"
              required
            />

            <TextField
              name="street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              className="text-purple"
              label="Straße"
              required
            />

            <TextField
              name="housenumber"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
              className="text-purple"
              label="Hausnummer"
              required
              type="number"
            />
          </div>

          <div className="flex justify-between gap-4">
            <TextField
              name="bank"
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="text-purple"
              label="Bank"
              required
            />

            <TextField
              name="iban"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="text-purple"
              label="IBAN"
              required
            />

            <TextField
              name="bic"
              value={bic}
              onChange={(e) => setBic(e.target.value)}
              className="text-purple"
              label="BIC"
              required
            />
          </div>

          <div className="flex justify-between gap-4">
            <TextField
              name="taxnumber"
              value={taxNumber}
              onChange={(e) => setTaxNumber(e.target.value)}
              className="text-purple"
              label="Steuernummer"
              required={!vatId}
            />

            <TextField
              name="vatId"
              value={vatId}
              onChange={(e) => setVatId(e.target.value)}
              className="text-purple"
              label="Umsatzsteuer-Identifikationsnummer"
              required={!taxNumber}
            />
          </div>

          <div className="flex justify-between gap-4">
            <TextField
              name="telephone"
              value={telephone}
              onChange={(e) => setTelephone(e.target.value)}
              className="text-purple"
              label="Telefonnummer"
              required
              type="tel"
            />

            <TextField
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-purple"
              label="E-Mail"
              required
              type="email"
            />
          </div>

          <div className="flex justify-end mt-4 ">
            <Button
              type="submit"
              className="bg-ice"
              loading={register.isLoading}
            >
              Registrieren
            </Button>
          </div>
        </Paper>
      </Form>
    </main>
  );
};

export default Register;
