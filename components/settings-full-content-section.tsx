import type { NextPage } from "next";
import SettingsContentSection from "./settings-content-section";

const SettingsFullContentSection: NextPage = () => {
  return (
    <div className="self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-base text-white-0 font-kumbh-sans">
      <SettingsContentSection />
    </div>
  );
};

export default SettingsFullContentSection;
