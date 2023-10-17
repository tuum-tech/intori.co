import type { NextPage } from "next";
import CheckboxActionNullIconContaine from "./checkbox-action-null-icon-containe";
import EmptyActionContainer from "./empty-action-container";

const DataUploadNameRow: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-2 flex flex-row items-center justify-start py-0 px-6 gap-[31px] text-left text-xs text-grey-1 font-kumbh-sans">
      <CheckboxActionNullIconContaine checkboxActionNullIconConBoxSizing="border-box" />
      <div className="flex-1 h-6 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0 box-border">
        <div className="relative font-semibold">Data Type</div>
      </div>
      <div className="w-[333px] flex flex-row items-center justify-between Small_Tablet:flex">
        <div className="relative font-semibold inline-block w-[70px] shrink-0">
          Value
        </div>
        <div className="relative font-semibold inline-block w-[90px] shrink-0">
          Purchased
        </div>
        <div className="relative font-semibold inline-block w-[90px] shrink-0">
          Uploaded
        </div>
        <EmptyActionContainer />
      </div>
    </div>
  );
};

export default DataUploadNameRow;
