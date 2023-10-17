import type { NextPage } from "next";
import CheckboxActionNullIconContaine from "./checkbox-action-null-icon-containe";
import UploadItemDataTypeContainer from "./upload-item-data-type-container";
import MoreDotsIconActionContainer from "./more-dots-icon-action-container";

const DataUploadItemDesktop: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini flex flex-row items-start justify-start py-3 px-6 gap-[31px] text-left text-xs text-white-1 font-kumbh-sans">
      <div className="self-stretch flex flex-row items-start justify-start Small_Tablet:flex">
        <CheckboxActionNullIconContaine checkboxActionNullIconConBoxSizing="border-box" />
      </div>
      <div className="flex-1 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0">
        <UploadItemDataTypeContainer />
      </div>
      <div className="w-[333px] flex flex-row items-center justify-between Small_Tablet:flex">
        <div className="relative inline-block w-[70px] shrink-0">$0.01</div>
        <div className="relative inline-block w-[90px] shrink-0">
          21 Aug 2021
        </div>
        <div className="relative inline-block w-[90px] shrink-0">
          01 Sep 2024
        </div>
        <MoreDotsIconActionContainer moreDotsIconActionContainBoxSizing="border-box" />
      </div>
    </div>
  );
};

export default DataUploadItemDesktop;
