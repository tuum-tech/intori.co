import type { NextPage } from "next";
import UserCredentialDesktop from "./user-credential-desktop";

const UserCredentialListContainer: NextPage = () => {
  return (
    <div className="self-stretch flex flex-col items-start justify-start text-left text-xs text-white-0 font-kumbh-sans">
      <UserCredentialDesktop />
    </div>
  );
};

export default UserCredentialListContainer;
