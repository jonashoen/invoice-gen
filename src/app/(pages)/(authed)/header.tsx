import Button from "@/components/Button";
import useApiMutation from "@/hooks/useApiMutation";
import Api from "@/routes/Api";
import useUserStore from "@/store/userStore";
import { useRouter } from "next/navigation";

const Header = () => {
  const router = useRouter();

  const logoutLocal = useUserStore((state) => state.logout);

  const logout = useApiMutation({
    route: Api.Logout,
    onSuccess: () => {
      router.replace("/login");
      logoutLocal();
    },
  });

  return (
    <header className="flex justify-between bg-purple py-4">
      <h1 className="font-bold py-4 text-xl text-white ml-8">invoice-gen</h1>
      <Button onClick={() => logout.mutate(null)} className="bg-white mr-8">
        Logout
      </Button>
    </header>
  );
};

export default Header;
