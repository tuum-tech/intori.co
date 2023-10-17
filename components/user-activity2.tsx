import type { NextPage } from "next";
import ToActionIconContainer from "./to-action-icon-container";

const UserActivity2: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini hidden flex-row items-center justify-between p-3 text-left text-sm text-white-0 font-kumbh-sans">
      <div className="flex-1 flex flex-row items-start justify-start gap-[12px]">
        <ToActionIconContainer />
        <div className="flex-1 flex flex-row items-center justify-start">
          <div className="flex-1 flex flex-col items-start justify-start gap-[7px]">
            <div className="self-stretch relative">
              Request Your Amazon Order History
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

export default UserActivity2;
