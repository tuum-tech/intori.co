import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type SideNavigationButtonSettingsType = {
  settingsIconContainer?: string;

  /** Style props */
  sideNavigationButtonSettiWidth?: CSSProperties["width"];
  sideNavigationButtonSettiBackgroundColor?: CSSProperties["backgroundColor"];
  sideNavigationButtonSettiBorder?: CSSProperties["border"];
  navInnerContentContainerWidth?: CSSProperties["width"];
  menuNavTextColor?: CSSProperties["color"];
};

const SideNavigationButtonSettings: NextPage<
  SideNavigationButtonSettingsType
> = ({
  settingsIconContainer,
  sideNavigationButtonSettiWidth,
  sideNavigationButtonSettiBackgroundColor,
  sideNavigationButtonSettiBorder,
  navInnerContentContainerWidth,
  menuNavTextColor,
}) => {
  const sideNavigationButtonSettingsStyle: CSSProperties = useMemo(() => {
    return {
      width: sideNavigationButtonSettiWidth,
      backgroundColor: sideNavigationButtonSettiBackgroundColor,
      border: sideNavigationButtonSettiBorder,
    };
  }, [
    sideNavigationButtonSettiWidth,
    sideNavigationButtonSettiBackgroundColor,
    sideNavigationButtonSettiBorder,
  ]);

  const navInnerContentContainer3Style: CSSProperties = useMemo(() => {
    return {
      width: navInnerContentContainerWidth,
    };
  }, [navInnerContentContainerWidth]);

  const menuNavText3Style: CSSProperties = useMemo(() => {
    return {
      color: menuNavTextColor,
    };
  }, [menuNavTextColor]);

  return (
    <div
      className="rounded-mini flex flex-col items-start justify-start p-4 text-left text-base text-white-1 font-kumbh-sans"
      style={sideNavigationButtonSettingsStyle}
    >
      <div
        className="w-40 h-6 flex flex-row items-center justify-start gap-[16px]"
        style={navInnerContentContainer3Style}
      >
        <img className="relative w-6 h-6" alt="" src={settingsIconContainer} />
        <div className="relative leading-[140%]" style={menuNavText3Style}>
          Settings
        </div>
      </div>
    </div>
  );
};

export default SideNavigationButtonSettings;
