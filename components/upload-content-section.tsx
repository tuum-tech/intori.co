import type { NextPage } from "next";
import TopNavBarContainer from "./top-nav-bar-container";
import UploadWidgetMainContainer from "./upload-widget-main-container";
import UploadWidgetDesktopBlock from "./upload-widget-desktop-block";
import UploadWidgetMobileBlock from "./upload-widget-mobile-block";

const UploadContentSection: NextPage = () => {
  return (
    <div className="w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-lg text-white-1 font-kumbh-sans">
      <TopNavBarContainer />
      <UploadWidgetMainContainer />
      <UploadWidgetDesktopBlock />
      <UploadWidgetMobileBlock />
    </div>
  );
};

export default UploadContentSection;
