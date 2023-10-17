import type { NextPage } from "next";
import UserActivityContent from "./user-activity-content";

const OverviewRightBarContainer: NextPage = () => {
  return (
    <div className="self-stretch w-[380px] flex flex-col items-start justify-start text-left text-sm text-white-0 font-kumbh-sans md:self-stretch md:w-auto Small_Tablet:self-stretch Small_Tablet:w-auto">
      <UserActivityContent />
    </div>
  );
};

export default OverviewRightBarContainer;
