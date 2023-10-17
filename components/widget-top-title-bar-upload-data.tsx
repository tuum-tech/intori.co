import type { NextPage } from "next";
import WidgetTitleHeaderContainer from "./widget-title-header-container";
import CreateCredentialsContainer from "./create-credentials-container";
import UploadDataContainer from "./upload-data-container";

const WidgetTopTitleBarUploadData: NextPage = () => {
  return (
    <div className="self-stretch h-14 flex flex-row items-center justify-start py-0 pr-0 pl-6 box-border gap-[20px] text-left text-xs text-white-1 font-kumbh-sans">
      <WidgetTitleHeaderContainer />
      <CreateCredentialsContainer />
      <UploadDataContainer />
    </div>
  );
};

export default WidgetTopTitleBarUploadData;
