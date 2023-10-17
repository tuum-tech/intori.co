import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type SettingsSelectionHeaderType = {
  /** Style props */
  settingsSelectionHeaderAlignSelf?: CSSProperties["alignSelf"];
};

const SettingsSelectionHeader: NextPage<SettingsSelectionHeaderType> = ({
  settingsSelectionHeaderAlignSelf,
}) => {
  const settingsSelectionHeaderStyle: CSSProperties = useMemo(() => {
    return {
      alignSelf: settingsSelectionHeaderAlignSelf,
    };
  }, [settingsSelectionHeaderAlignSelf]);

  return (
    <div
      className="h-[54px] flex flex-row items-start justify-start pt-[30px] px-0 pb-0 box-border gap-[26px] text-left text-sm text-white-0 font-kumbh-sans"
      style={settingsSelectionHeaderStyle}
    >
      <div className="relative w-[52px] h-6">
        <img
          className="absolute top-[22.25px] left-[0.25px] w-[52.5px] h-[1.5px]"
          alt=""
          src="/settingactiveline.svg"
        />
        <div className="absolute top-[0px] left-[0px]">General</div>
      </div>
      <div className="self-stretch relative w-[52px] text-grey-1">
        <div className="absolute top-[0px] left-[0px]">Profile</div>
      </div>
    </div>
  );
};

export default SettingsSelectionHeader;
