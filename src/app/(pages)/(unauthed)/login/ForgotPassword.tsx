import Button from "@/components/Button";
import Chip from "@/components/Chip";
import Form from "@/components/Form";
import TextField from "@/components/TextField";
import useApiMutation from "@/hooks/useApiMutation";
import {
  CheckResetPasswordCodeRequest,
  RequestResetPasswordRequest,
  ResetPasswordRequest,
} from "@/interfaces/requests/user";
import Api from "@/routes/Api";
import useModalStore from "@/store/modalStore";
import { StatusCodes } from "http-status-codes";
import { useEffect, useState } from "react";

enum Steps {
  Email = 1,
  Code = 2,
  Passsword = 3,
  Success = 4,
}

const Step1 = ({ handleNext }: { handleNext: (email: string) => void }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const sendRestoreCodeMutation = useApiMutation<RequestResetPasswordRequest>({
    route: Api.RequestResetPassword,
    onSuccess: () => handleNext(email),
    onError: () =>
      setError(
        "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
      ),
  });

  const sendRestoreCode = () => {
    setError("");

    sendRestoreCodeMutation.mutate({ email });
  };

  return (
    <Form onSubmit={sendRestoreCode} className="flex flex-col gap-4 mt-10">
      <p>
        Bitte gib deine E-Mail-Adresse ein. Du erhälst dann eine Mail mit einem
        Wiederherstellungscode.
      </p>

      {error && (
        <Chip className="bg-red-600 text-white text-center">{error}</Chip>
      )}

      <TextField
        value={email}
        setValue={setEmail}
        label="E-Mail"
        required
        name="email"
        type="email"
      />

      <div className="flex justify-end mt-10">
        <Button
          className="bg-ice"
          type="submit"
          loading={sendRestoreCodeMutation.isLoading}
        >
          Weiter
        </Button>
      </div>
    </Form>
  );
};

const Step2 = ({
  email,
  handleBack,
  handleNext,
}: {
  email: string;
  handleBack: () => void;
  handleNext: (code: string) => void;
}) => {
  const CODE_LENGHT = 6;

  const [code, setCode] = useState("");
  const [codeFocused, setCodeFocused] = useState(false);
  const [error, setError] = useState("");

  const checkRestoreCodeMutation =
    useApiMutation<CheckResetPasswordCodeRequest>({
      route: Api.CheckResetPasswordCode,
      onSuccess: () => handleNext(code),
      onError: (apiError) => {
        if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
          setError("Der eingegebene Code ist falsch.");
        } else {
          setError(
            "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
          );
        }
      },
    });

  const checkRestoreCode = () => {
    checkRestoreCodeMutation.mutate({
      email,
      code,
    });
  };

  useEffect(() => {
    setError("");

    if (code.length === CODE_LENGHT) {
      checkRestoreCode();
    }
  }, [code]);

  return (
    <Form onSubmit={checkRestoreCode} className="flex flex-col gap-4 mt-10">
      <p>
        Bitte gib jetzt den Code ein, den du per E-Mail an{" "}
        <span className="text-purple">{email}</span> bekommen hast.
      </p>

      {error && (
        <Chip className="bg-red-600 text-white text-center">{error}</Chip>
      )}

      <div className="flex justify-center">
        <div className="relative w-min">
          <div className="flex gap-4">
            {[...Array(6).fill(0)].map((_, i) => (
              <div className="w-[70px]">
                <TextField
                  value={code[i] ?? "•"}
                  readOnly
                  maxLength={1}
                  className={[
                    "text-center aspect-square uppercase text-3xl",
                    code.length === i &&
                      codeFocused &&
                      "!border-purple text-purple",
                  ].join(" ")}
                />
              </div>
            ))}
          </div>

          <TextField
            value={code}
            setValue={(c) => c.trim() !== code && setCode(c)}
            className="absolute bottom-0 w-full opacity-0 text-3xl h-[70px]"
            required
            minLength={CODE_LENGHT}
            maxLength={CODE_LENGHT}
            name="code"
            autoFocus
            onFocus={() => setCodeFocused(true)}
            onBlur={() => setCodeFocused(false)}
          />
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <Button
          className="bg-pink text-white"
          type="button"
          loading={checkRestoreCodeMutation.isLoading}
          onClick={handleBack}
        >
          Zurück
        </Button>
        <Button
          className="bg-ice"
          type="submit"
          loading={checkRestoreCodeMutation.isLoading}
          disabled={!!error}
        >
          Weiter
        </Button>
      </div>
    </Form>
  );
};

const Step3 = ({
  email,
  code,
  handleNext,
}: {
  email: string;
  code: string;
  handleNext: () => void;
}) => {
  const [error, setError] = useState("");

  const resetPasswordMutation = useApiMutation<ResetPasswordRequest>({
    route: Api.ResetPassword,
    onSuccess: handleNext,
    onError: (apiError) => {
      if (apiError.statusCode === StatusCodes.BAD_REQUEST) {
        setError("Die Passwörter stimmen nicht über ein.");
      } else {
        setError(
          "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
        );
      }
    },
  });

  const [newPassword, setNewPassword] = useState("");
  const [newPasswordRepeated, setNewPasswordRepeated] = useState("");

  const resetPassword = () => {
    setError("");

    resetPasswordMutation.mutate({
      email,
      code,
      newPassword,
      newPasswordRepeated,
    });
  };

  return (
    <Form onSubmit={resetPassword} className="flex flex-col gap-4 mt-10">
      <p>Gib jetzt dein neues Passwort ein.</p>

      {error && (
        <Chip className="bg-red-600 text-white text-center">{error}</Chip>
      )}

      <TextField
        value={newPassword}
        setValue={setNewPassword}
        label="Neues Passwort"
        name="newPassword"
        required
        type="password"
      />
      <TextField
        value={newPasswordRepeated}
        setValue={setNewPasswordRepeated}
        label="Neues Passwort wiederholen"
        name="newPasswordRepeated"
        required
        type="password"
      />

      <div className="flex justify-end mt-10">
        <Button
          className="bg-ice"
          type="submit"
          loading={resetPasswordMutation.isLoading}
        >
          Weiter
        </Button>
      </div>
    </Form>
  );
};

const Step4 = ({ handleNext }: { handleNext: () => void }) => {
  return (
    <Form onSubmit={handleNext} className="flex flex-col gap-4 mt-10">
      <Chip className="bg-green text-center">
        Dein Passwort wurde erfolgreich geändert, du kannst dich jetzt anmelden.
      </Chip>
      <div className="flex justify-end mt-10">
        <Button className="bg-ice" type="submit">
          Ok
        </Button>
      </div>
    </Form>
  );
};

const ForgotPassword = () => {
  const hideModal = useModalStore((state) => state.hide);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const [step, setStep] = useState<Steps>(Steps.Email);

  switch (step) {
    case Steps.Email:
      return (
        <Step1
          handleNext={(email) => {
            setEmail(email);
            setStep(Steps.Code);
          }}
        />
      );
    case Steps.Code:
      return (
        <Step2
          email={email}
          handleBack={() => {
            setStep(Steps.Email);
          }}
          handleNext={(code) => {
            setCode(code);
            setStep(Steps.Passsword);
          }}
        />
      );
    case Steps.Passsword:
      return (
        <Step3
          email={email}
          code={code}
          handleNext={() => {
            setStep(Steps.Success);
          }}
        />
      );
    default:
      return <Step4 handleNext={hideModal} />;
  }
};

export default ForgotPassword;
