"use client";

import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Form from "@/components/Form";
import Header from "@/components/Header";
import Loader from "@/components/Loader";
import Paper from "@/components/Paper";
import TextField from "@/components/TextField";
import useApi from "@/hooks/useApi";
import useApiMutation from "@/hooks/useApiMutation";
import {
  ChangePasswordRequest,
  EditUserRequest,
} from "@/interfaces/requests/user";
import Api from "@/routes/Api";
import { User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";

const Profile = () => {
  const { data: user, isFetching } = useApi<User>({
    route: Api.GetUser,
    onSuccess: (data) => {
      setUsername(data.username);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setZipCode(data.zipCode);
      setCity(data.city);
      setStreet(data.street);
      setHouseNumber(data.houseNumber);
      setBank(data.bank);
      setIban(data.iban);
      setBic(data.bic);
      setTaxNumber(data.taxNumber);
      setVatId(data.vatId);
      setTelephone(data.telephone);
      setEmail(data.email);
    },
  });

  const [userError, setUserError] = useState<string | null>(null);
  const [userSuccess, setUserSuccess] = useState<boolean | null>(null);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean | null>(null);

  const editUserMutation = useApiMutation<EditUserRequest>({
    route: Api.EditUser,
    onSuccess: () => setUserSuccess(true),
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setUserError("Der Nutzername existiert bereits.");
      } else {
        setUserError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const changePasswordMutation = useApiMutation<ChangePasswordRequest>({
    route: Api.ChangePassword,
    onSuccess: () => setPasswordSuccess(true),
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setPasswordError(
          "Altes Passwort falsch oder neue Passwörter stimmen nicht über ein."
        );
      } else {
        setPasswordError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const [username, setUsername] = useState("");
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

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeated, setNewPasswordRepeated] = useState("");

  const editUser = () => {
    setUserError(null);
    setUserSuccess(null);

    editUserMutation.mutate({
      username,
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

  const changePassword = () => {
    setPasswordError(null);
    setPasswordSuccess(null);

    changePasswordMutation.mutate({
      oldPassword,
      newPassword,
      newPasswordRepeated,
    });
  };

  const editButtonEnabled =
    !isFetching &&
    username &&
    firstName &&
    lastName &&
    zipCode &&
    city &&
    street &&
    houseNumber &&
    bank &&
    iban &&
    bic &&
    (taxNumber || vatId) &&
    telephone &&
    email &&
    (user.username !== username ||
      user.firstName !== firstName ||
      user.lastName !== lastName ||
      user.zipCode !== zipCode ||
      user.city !== city ||
      user.street !== street ||
      user.houseNumber !== houseNumber ||
      user.bank !== bank ||
      user.iban !== iban ||
      user.bic !== bic ||
      user.taxNumber !== taxNumber ||
      user.vatId !== vatId ||
      user.telephone !== telephone ||
      user.email !== email);

  const changePasswordButtonDisabled =
    !oldPassword ||
    !newPassword ||
    !newPasswordRepeated ||
    newPassword !== newPasswordRepeated;

  return (
    <main>
      <Header title="Profil" />

      {!isFetching ? (
        <>
          <Form onSubmit={editUser}>
            <Paper className="bg-white gap-2 !py-8">
              {userError && (
                <Chip className="bg-red-600 text-white text-center mb-8">
                  {userError}
                </Chip>
              )}

              {userSuccess && (
                <Chip className="bg-green text-center mb-8">
                  Die Daten wurden erfolgreich aktualisiert.
                </Chip>
              )}

              <p className="text-xl">
                Erstellt am: {new Date(user.createdAt).toLocaleDateString()}
              </p>

              <TextField
                name="username"
                value={username}
                setValue={setUsername}
                label="Nutzername"
                required
              />

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

              <div className="flex justify-end mt-10">
                <Button
                  className="bg-ice"
                  loading={editUserMutation.isLoading}
                  disabled={!editButtonEnabled}
                >
                  Speichern
                </Button>
              </div>
            </Paper>
          </Form>

          <Form onSubmit={changePassword} className="mt-10">
            <Paper className="bg-white gap-2 !py-8">
              {passwordError && (
                <Chip className="bg-red-600 text-white text-center mb-8">
                  {passwordError}
                </Chip>
              )}

              {passwordSuccess && (
                <Chip className="bg-green text-center mb-8">
                  Das Password wurde erfolgreich aktualisiert.
                </Chip>
              )}

              <p className="text-xl">Passwort ändern:</p>

              <TextField name="username" value={user.username} type="hidden" />

              <TextField
                name="oldPassword"
                value={oldPassword}
                setValue={setOldPassword}
                label="Altes Passwort"
                required
                type="password"
              />

              <div className="flex gap-4">
                <TextField
                  name="newPassword"
                  value={newPassword}
                  setValue={setNewPassword}
                  label="Neues Passwort"
                  required
                  type="password"
                />
                <TextField
                  name="newPasswordRepeated"
                  value={newPasswordRepeated}
                  setValue={setNewPasswordRepeated}
                  label="Neues Passwort wiederholen"
                  required
                  type="password"
                />
              </div>

              <div className="flex justify-end mt-10">
                <Button
                  className="bg-ice"
                  loading={changePasswordMutation.isLoading}
                  disabled={changePasswordButtonDisabled}
                >
                  Ändern
                </Button>
              </div>
            </Paper>
          </Form>
        </>
      ) : (
        <Loader />
      )}
    </main>
  );
};

export default Profile;
