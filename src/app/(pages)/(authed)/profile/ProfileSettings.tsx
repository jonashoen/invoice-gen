"use client";

import Button from "@/components/Button";
import Form from "@/components/Form";
import Info from "@/components/Info";
import Paper from "@/components/Paper";
import TextField from "@/components/TextField";
import dateToDateString from "@/helper/dateToDateString";
import useApiMutation from "@/hooks/useApiMutation";
import {
  ChangePasswordRequest,
  CheckEmailRequest,
  CheckUsernameRequest,
  EditUserRequest,
} from "@/interfaces/requests";
import Api from "@/routes/Api";
import { Profile, User } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { useDeferredValue, useEffect, useState } from "react";

interface Props {
  user: Pick<User, "username" | "createdAt"> & {
    profile: Omit<Profile, "userId"> | null;
  };
}

const ProfileSettings: React.FC<Props> = ({ user }) => {
  const [userError, setUserError] = useState<string | null>(null);
  const [userSuccess, setUserSuccess] = useState<boolean | null>(null);

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<boolean | null>(null);

  const [usernameAvailable, setUsernameAvailable] = useState<
    boolean | undefined
  >();

  const [emailAvailable, setEmailAvailable] = useState<boolean | undefined>();

  const checkUsernameMutation = useApiMutation<CheckUsernameRequest>({
    route: Api.CheckUsername,
    onSuccess: () => setUsernameAvailable(true),
    onError: () => setUsernameAvailable(false),
  });

  const checkEmailMutation = useApiMutation<CheckEmailRequest>({
    route: Api.CheckEmail,
    onSuccess: () => setEmailAvailable(true),
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setEmailAvailable(false);
      } else {
        setEmailAvailable(true);
      }
    },
  });

  const editUserMutation = useApiMutation<EditUserRequest>({
    route: Api.EditUser,
    invalidates: [Api.GetUser],
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
    invalidates: [Api.GetUser],
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

  const [username, setUsername] = useState(user.username);
  const debouncedUsername = useDeferredValue(username);
  const [firstName, setFirstName] = useState(user.profile?.firstName ?? "");
  const [lastName, setLastName] = useState(user.profile?.lastName ?? "");
  const [zipCode, setZipCode] = useState(user.profile?.zipCode ?? "");
  const [city, setCity] = useState(user.profile?.city ?? "");
  const [street, setStreet] = useState(user.profile?.street ?? "");
  const [houseNumber, setHouseNumber] = useState(
    user.profile?.houseNumber ?? ""
  );
  const [bank, setBank] = useState(user.profile?.bank ?? "");
  const [iban, setIban] = useState(user.profile?.iban ?? "");
  const [bic, setBic] = useState(user.profile?.bic ?? "");
  const [taxNumber, setTaxNumber] = useState(user.profile?.taxNumber ?? "");
  const [vatId, setVatId] = useState(user.profile?.vatId ?? "");
  const [telephone, setTelephone] = useState(user.profile?.telephone ?? "");
  const [email, setEmail] = useState(user.profile?.email ?? "");
  const debouncedEmail = useDeferredValue(email);

  const callCheckUsername = checkUsernameMutation.mutate;

  useEffect(() => {
    if (!debouncedUsername) {
      return;
    }

    if (debouncedUsername === user.username) {
      setUsernameAvailable(undefined);
      return;
    }

    callCheckUsername({ username: debouncedUsername });
  }, [debouncedUsername, user?.username, callCheckUsername]);

  const callCheckEmail = checkEmailMutation.mutate;

  useEffect(() => {
    if (!debouncedEmail) {
      return;
    }

    if (debouncedEmail === user.profile?.email) {
      setEmailAvailable(undefined);
      return;
    }

    callCheckEmail({ email: debouncedEmail });
  }, [debouncedEmail, user?.profile?.email, callCheckEmail]);

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
      taxNumber: taxNumber || undefined,
      vatId: vatId || undefined,
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
    username &&
    usernameAvailable !== false &&
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
    emailAvailable !== false &&
    (user.username !== username ||
      user.profile?.firstName !== firstName ||
      user.profile?.lastName !== lastName ||
      user.profile?.zipCode !== zipCode ||
      user.profile?.city !== city ||
      user.profile?.street !== street ||
      user.profile?.houseNumber !== houseNumber ||
      user.profile?.bank !== bank ||
      user.profile?.iban !== iban ||
      user.profile?.bic !== bic ||
      user.profile?.taxNumber !== taxNumber ||
      user.profile?.vatId !== vatId ||
      user.profile?.telephone !== telephone ||
      user.profile?.email !== email);

  const changePasswordButtonDisabled =
    !oldPassword ||
    !newPassword ||
    !newPasswordRepeated ||
    newPassword !== newPasswordRepeated;

  return (
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
            Erstellt am: {dateToDateString(user.createdAt)}
          </p>

          <div className="flex flex-col">
            <TextField
              name="username"
              value={username}
              setValue={setUsername}
              label="Nutzername"
              required
            />

            {usernameAvailable === false && (
              <p className="text-red-600 text-sm">
                Der Nutzername ist bereits vergeben.
              </p>
            )}

            {usernameAvailable === true && (
              <p className="text-emerald-500 text-sm">
                Der Nutzername ist verfügbar.
              </p>
            )}
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
              value={taxNumber ?? ""}
              setValue={setTaxNumber}
              label="Steuernummer"
              required={!vatId}
            />

            <TextField
              name="vatId"
              value={vatId ?? ""}
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

            <div className="flex flex-col flex-1">
              <TextField
                name="email"
                value={email}
                setValue={setEmail}
                label="E-Mail"
                required
                type="email"
              />

              {emailAvailable === false && (
                <p className="text-red-600 text-sm">
                  Die E-Mail Adresse ist bereits vergeben.
                </p>
              )}

              {emailAvailable === true && (
                <p className="text-emerald-500 text-sm">
                  Die E-Mail Adresse ist verfügbar.
                </p>
              )}
            </div>
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
  );
};

export default ProfileSettings;
