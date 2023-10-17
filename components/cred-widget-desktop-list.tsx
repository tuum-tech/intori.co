import type { NextPage } from "next";
import WidgetTopTitleBarCredentials from "./widget-top-title-bar-credentials";
import CredentialsNameRow from "./credentials-name-row";
import NoCredentials from "./no-credentials";
import UserCredentialListContainer from "./user-credential-list-container";
import UserCredentialDesktop from "./user-credential-desktop";

const CredWidgetDesktopList: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-1 box-border overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] min-w-[658px] text-left text-xs text-white-0 font-kumbh-sans border-[1px] border-solid border-black-4">
      <WidgetTopTitleBarCredentials />
      <CredentialsNameRow />
      <NoCredentials />
      <UserCredentialListContainer />
      <UserCredentialDesktop />
      <UserCredentialDesktop />
      <UserCredentialDesktop />
    </div>
  );
};

export default CredWidgetDesktopList;
