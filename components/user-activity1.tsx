import type { NextPage } from "next";
import AccountIconContainer from "./account-icon-container";

const UserActivity1: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini flex flex-row items-center justify-between p-3 text-left text-sm text-white-0 font-kumbh-sans">
      <div className="flex-1 flex flex-row items-start justify-start gap-[12px]">
        <AccountIconContainer profileIconContainer="/profileiconcontainer2.svg" />
        <div className="flex-1 flex flex-row items-center justify-start">
          <div className="flex-1 flex flex-col items-start justify-start gap-[7px]">
            <div className="self-stretch relative">
              Account Creation Successful
            </div>
            <div className="relative text-xs text-white-1 text-right">
              Just now
            </div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex flex-row items-center justify-start">
        <img
          className="relative w-[7px] h-[7px]"
          alt=""
          src="/notificationdoticon.svg"
        />
      </div>
    </div>
  );
};

export default UserActivity1;
