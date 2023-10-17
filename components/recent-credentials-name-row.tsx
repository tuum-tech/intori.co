import type { NextPage } from "next";
import EmptyActionContainer from "./empty-action-container";

const RecentCredentialsNameRow: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-2 h-14 flex flex-row items-center justify-start py-0 px-6 box-border text-left text-xs text-grey-1 font-kumbh-sans">
      <div className="flex-1 h-6 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0 box-border">
        <div className="relative font-semibold">Credential Type</div>
      </div>
      <div className="w-[195px] flex flex-row items-center justify-end gap-[24px] Small_Tablet:flex">
        <div className="relative font-semibold inline-block w-[70px] shrink-0">
          Value
        </div>
        <EmptyActionContainer />
      </div>
    </div>
  );
};

export default RecentCredentialsNameRow;
