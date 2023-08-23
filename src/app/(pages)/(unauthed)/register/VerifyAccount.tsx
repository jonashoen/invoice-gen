import Button from "@/components/Button";
import Chip from "@/components/Chip";
import CodeInput, { CODE_LENGHT } from "@/components/CodeInput";
import Form from "@/components/Form";
import useApiMutation from "@/hooks/useApiMutation";
import { VerifyAccountRequest } from "@/interfaces/requests/user";
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
      router.push(Pages.Dashboard);
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

  const [error, setError] = useState("");
  const [code, setCode] = useState("");

  const verifyAccount = () => {
    verifyAccountMutation.mutate({ username, code });
  };

  useEffect(() => {
    setError("");

    if (code.length === CODE_LENGHT) {
      verifyAccount();
    }
  }, [code]);

  return (
    <Form onSubmit={verifyAccount} className="gap-4">
      {error && (
        <Chip className="bg-red-600 text-white text-center mt-4">{error}</Chip>
      )}

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
          loading={verifyAccountMutation.isLoading}
        >
          Verifizieren
        </Button>
      </div>
    </Form>
  );
};

export default VerifyAccount;
