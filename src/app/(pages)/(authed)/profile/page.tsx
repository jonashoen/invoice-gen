"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Header from "@/components/Header";
import Info from "@/components/Info";
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
import { Profile, User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { useState } from "react";

const Profile = () => {
  const { data: user, isFetching } = useApi<User & { profile: Profile }>({
    route: Api.GetUser,
    onSuccess: (data) => {
      setUsername(data.username);
      setFirstName(data.profile.firstName);
      setLastName(data.profile.lastName);
      setZipCode(data.profile.zipCode);
      setCity(data.profile.city);
      setStreet(data.profile.street);
      setHouseNumber(data.profile.houseNumber);
      setBank(data.profile.bank);
      setIban(data.profile.iban);
      setBic(data.profile.bic);
      setTaxNumber(data.profile.taxNumber);
      setVatId(data.profile.vatId);
      setTelephone(data.profile.telephone);
      setEmail(data.profile.email);
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
      } else if (apiError.statusCode === StatusCodes.UNPROCESSABLE_ENTITY) {
        setUserError("Die IBAN oder die BIC sind ungültig.");
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
      user.profile.firstName !== firstName ||
      user.profile.lastName !== lastName ||
      user.profile.zipCode !== zipCode ||
      user.profile.city !== city ||
      user.profile.street !== street ||
      user.profile.houseNumber !== houseNumber ||
      user.profile.bank !== bank ||
      user.profile.iban !== iban ||
      user.profile.bic !== bic ||
      user.profile.taxNumber !== taxNumber ||
      user.profile.vatId !== vatId ||
      user.profile.telephone !== telephone ||
      user.profile.email !== email);

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
            <Paper className="gap-2 !py-8">
              {userError && (
                <Info severity="error" className="text-white mb-8">
                  {userError}
                </Info>
              )}

              {userSuccess && (
                <Info severity="success" className="mb-8">
                  Die Daten wurden erfolgreich aktualisiert.
                </Info>
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
            <Paper className="gap-2 !py-8">
              {passwordError && (
                <Info severity="error" className="mb-8">
                  {passwordError}
                </Info>
              )}

              {passwordSuccess && (
                <Info severity="success" className="mb-8">
                  Das Password wurde erfolgreich aktualisiert.
                </Info>
              )}

              <p className="text-xl">Passwort ändern:</p>

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
