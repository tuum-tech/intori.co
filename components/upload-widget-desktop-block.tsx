import type { NextPage } from "next";
import WidgetTopTitleBarUploadData from "./widget-top-title-bar-upload-data";
import DataUploadNameRow from "./data-upload-name-row";
import DataUploadItemListContainer from "./data-upload-item-list-container";

const UploadWidgetDesktopBlock: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-xs text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4 Small_Tablet:hidden">
      <WidgetTopTitleBarUploadData />
      <DataUploadNameRow />
      <DataUploadItemListContainer />
    </div>
  );
};

export default UploadWidgetDesktopBlock;
