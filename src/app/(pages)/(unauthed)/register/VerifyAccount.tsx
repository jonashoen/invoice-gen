import Button from "@/components/Button";
import CodeInput, { CODE_LENGHT } from "@/components/CodeInput";
import Form from "@/components/Form";
import Info from "@/components/Info";
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
import { useState } from "react";

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

  const verifyAccount = () => {
    setSuccess("");
    verifyAccountMutation.mutate({ username, code });
  };

  const resendVerifyCode = () => {
    setError("");
    setSuccess("");

    resendVerifyCodeMutation.mutate({ username });
  };

  return (
    <Form onSubmit={verifyAccount} className="gap-4">
      {error && (
        <Info severity="error" className="mt-4">
          {error}
        </Info>
      )}

      {success && (
        <Info severity="success" className="mt-4">
          {success}
        </Info>
      )}

      <p>
        Du hast gerade eine E-Mail mit einem Verifizierungs-Code erhalten. Bitte
        gib diesen jetzt hier ein:
      </p>

      <CodeInput
        code={code}
        setCode={(c) => {
          setError("");
          setCode(c);
        }}
      />

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
