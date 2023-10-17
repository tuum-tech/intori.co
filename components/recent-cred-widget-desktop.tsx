import type { NextPage } from "next";
import WidgetTopTitleBarRecentCreds from "./widget-top-title-bar-recent-creds";
import RecentCredentialsNameRow from "./recent-credentials-name-row";
import NoCredentials from "./no-credentials";
import RecentCredentialDesktop from "./recent-credential-desktop";

const RecentCredWidgetDesktop: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-1 box-border overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] min-w-[500px] text-left text-xs text-white-0 font-kumbh-sans border-[1px] border-solid border-black-4">
      <WidgetTopTitleBarRecentCreds />
      <RecentCredentialsNameRow />
      <NoCredentials />
      <RecentCredentialDesktop />
      <RecentCredentialDesktop />
      <RecentCredentialDesktop />
    </div>
  );
};

export default RecentCredWidgetDesktop;
