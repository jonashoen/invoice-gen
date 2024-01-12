import Header from "@/components/Header";

import isAuthed from "@/lib/isAuthed";
import user from "@/services/user";
import ProfileSettings from "./ProfileSettings";

const metadata = { title: "Rechnungen - ig" };

const Profile = async () => {
  const userId = await isAuthed();
  const currentUser = await user.get(userId!);

  return (
    <main>
      <Header title="Profil" />

      <ProfileSettings user={currentUser!} />
    </main>
  );
};

export default Profile;
export { metadata };
