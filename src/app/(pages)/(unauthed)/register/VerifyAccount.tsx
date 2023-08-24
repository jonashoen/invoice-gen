import Button from "@/components/Button";
import Chip from "@/components/Chip";
import CodeInput, { CODE_LENGHT } from "@/components/CodeInput";
import Form from "@/components/Form";
import useApiMutation from "@/hooks/useApiMutation";
import {
  ResendVerifyCodeRequest,
  VerifyAccountRequest,
} from "@/interfaces/requests/user";
import Api from "@/routes/Api";
import Pages from "@/routes/Pages";
import useModalStore from "@/store/modalStore";
import useUserStore from "@/store/userStore";
import { StatusCodes } from "http-status-codes";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface Props {
  username: string;
}

const VerifyAccount: React.FC<Props> = ({ username }) => {
  const router = useRouter();

  const login = useUserStore((state) => state.login);
  const hideModal = useModalStore((state) => state.hide);

  const verifyAccountMutation = useApiMutation<VerifyAccountRequest>({
    route: Api.VerifyAccount,
    onSuccess: () => {
      login();
      hideModal();
      router.push(Pages.Invoices);
    },
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

  const resendVerifyCodeMutation = useApiMutation<ResendVerifyCodeRequest>({
    route: Api.ResendVerifyCode,
    onSuccess: () => {
      setSuccess("Der Code wurde erneut versandt.");
    },
    onError: () => {
      setError(
        "Ein unerwarteter Fehler ist aufgetreten, bitte nochmal versuchen."
      );
    },
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  const verifyAccount = useCallback(() => {
    setSuccess("");
    verifyAccountMutation.mutate({ username, code });
  }, [verifyAccountMutation, username, code]);

  const resendVerifyCode = () => {
    setError("");
    setSuccess("");

    resendVerifyCodeMutation.mutate({ username });
  };

  useEffect(() => {
    setError("");

    if (code.length === CODE_LENGHT) {
      verifyAccount();
    }
  }, [code, verifyAccount]);

  return (
    <Form onSubmit={verifyAccount} className="gap-4">
      {error && (
        <Chip className="bg-red-600 text-white text-center mt-4">{error}</Chip>
      )}

      {success && <Chip className="bg-green text-center mt-4">{success}</Chip>}

      <p>
        Du hast gerade eine E-Mail mit einem Verifizierungs-Code erhalten. Bitte
        gib diesen jetzt hier ein:
      </p>

      <CodeInput code={code} setCode={setCode} />

      <div className="flex justify-end mt-10">
        <Button
          type="submit"
          className="bg-ice"
          disabled={code.length !== CODE_LENGHT}
          loading={
            verifyAccountMutation.isLoading ||
            resendVerifyCodeMutation.isLoading
          }
        >
          Verifizieren
        </Button>
      </div>

      <p>
        Du has keinen Code erhalten? Dann klicke bitte{" "}
        <Button
          type="button"
          onClick={resendVerifyCode}
          className="bg-pink text-white"
          loading={
            resendVerifyCodeMutation.isLoading ||
            verifyAccountMutation.isLoading
          }
        >
          hier
        </Button>
        , wir schicken dir einen neuen zu.
      </p>
    </Form>
  );
};

export default VerifyAccount;
