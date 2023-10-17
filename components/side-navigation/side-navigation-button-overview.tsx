import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type SideNavigationButtonOverviewType = {
  overviewIconContainer?: string;

  /** Style props */
  sideNavigationButtonOvervBackgroundColor?: CSSProperties["backgroundColor"];
  sideNavigationButtonOvervBorder?: CSSProperties["border"];
  sideNavigationButtonOvervWidth?: CSSProperties["width"];
  navInnerContentContainerWidth?: CSSProperties["width"];
  menuNavTextColor?: CSSProperties["color"];
};

const SideNavigationButtonOverview: NextPage<
  SideNavigationButtonOverviewType
> = ({
  overviewIconContainer,
  sideNavigationButtonOvervBackgroundColor,
  sideNavigationButtonOvervBorder,
  sideNavigationButtonOvervWidth,
  navInnerContentContainerWidth,
  menuNavTextColor,
}) => {
  const sideNavigationButtonOverviewStyle: CSSProperties = useMemo(() => {
    return {
      backgroundColor: sideNavigationButtonOvervBackgroundColor,
      border: sideNavigationButtonOvervBorder,
      width: sideNavigationButtonOvervWidth,
    };
  }, [
    sideNavigationButtonOvervBackgroundColor,
    sideNavigationButtonOvervBorder,
    sideNavigationButtonOvervWidth,
  ]);

  const navInnerContentContainerStyle: CSSProperties = useMemo(() => {
    return {
      width: navInnerContentContainerWidth,
    };
  }, [navInnerContentContainerWidth]);

  const menuNavTextStyle: CSSProperties = useMemo(() => {
    return {
      color: menuNavTextColor,
    };
  }, [menuNavTextColor]);

  return (
    <div
      className="rounded-mini flex flex-col items-start justify-start p-4 text-left text-base text-white-1 font-kumbh-sans"
      style={sideNavigationButtonOverviewStyle}
    >
      <div
        className="w-40 h-6 flex flex-row items-center justify-start gap-[16px]"
        style={navInnerContentContainerStyle}
      >
        <img className="relative w-6 h-6" alt="" src={overviewIconContainer} />
        <div className="relative leading-[140%]" style={menuNavTextStyle}>
          Dashboard
        </div>
      </div>
    </div>
  );
};

export default SideNavigationButtonOverview;
