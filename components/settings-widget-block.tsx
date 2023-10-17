import type { NextPage } from "next";
import SettingTitleValue from "./setting-title-value";
import SettingContentContainer from "./setting-content-container";

const SettingsWidgetBlock: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[35px] text-left text-base text-white-0 font-kumbh-sans border-[1px] border-solid border-black-4">
      <SettingTitleValue />
      <SettingContentContainer />
    </div>
  );
};

export default SettingsWidgetBlock;
