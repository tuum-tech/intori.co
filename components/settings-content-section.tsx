import type { NextPage } from "next";
import TopNavBarContainer from "./top-nav-bar-container";
import TopTitleSettingsContainerSecti from "./top-title-settings-container-secti";
import SettingsWidgetBlock from "./settings-widget-block";

const SettingsContentSection: NextPage = () => {
  return (
    <div className="w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px] text-left text-base text-white-0 font-kumbh-sans">
      <TopNavBarContainer />
      <TopTitleSettingsContainerSecti />
      <SettingsWidgetBlock />
    </div>
  );
};

export default SettingsContentSection;
