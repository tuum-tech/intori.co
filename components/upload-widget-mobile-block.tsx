import type { NextPage } from "next";
import WidgetTopTitleBarUploadData1 from "./widget-top-title-bar-upload-data1";
import DataUploadItemMobile from "./data-upload-item-mobile";

const UploadWidgetMobileBlock: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-1 overflow-hidden hidden flex-col items-start justify-start p-6 gap-[15px] border-[1px] border-solid border-black-4 Small_Tablet:flex">
      <WidgetTopTitleBarUploadData1 uploadIconContainer="/uploadiconcontainer1.svg" />
      <div className="self-stretch flex flex-col items-start justify-start gap-[15px]">
        <DataUploadItemMobile />
        <DataUploadItemMobile />
        <DataUploadItemMobile />
        <DataUploadItemMobile />
        <DataUploadItemMobile />
      </div>
    </div>
  );
};

export default UploadWidgetMobileBlock;
