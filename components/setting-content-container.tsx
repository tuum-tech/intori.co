import type { NextPage } from "next";
import SettingContentContainer2 from "./setting-content-container2";
import SwitchToggleDarkActive from "./switch-toggle-dark-active";

const SettingContentContainer: NextPage = () => {
  return (
    <div className="self-stretch flex flex-row items-center justify-between text-left text-base text-white-0 font-kumbh-sans">
      <SettingContentContainer2 />
      <SwitchToggleDarkActive />
    </div>
  );
};

export default SettingContentContainer;
