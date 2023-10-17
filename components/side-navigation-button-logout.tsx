import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type SideNavigationButtonLogoutType = {
  /** Style props */
  sideNavigationButtonLogouWidth?: CSSProperties["width"];
  navInnerContentContainerWidth?: CSSProperties["width"];
  menuNavTextFlex?: CSSProperties["flex"];
};

const SideNavigationButtonLogout: NextPage<SideNavigationButtonLogoutType> = ({
  sideNavigationButtonLogouWidth,
  navInnerContentContainerWidth,
  menuNavTextFlex,
}) => {
  const sideNavigationButtonLogoutStyle: CSSProperties = useMemo(() => {
    return {
      width: sideNavigationButtonLogouWidth,
    };
  }, [sideNavigationButtonLogouWidth]);

  const navInnerContentContainer4Style: CSSProperties = useMemo(() => {
    return {
      width: navInnerContentContainerWidth,
    };
  }, [navInnerContentContainerWidth]);

  const menuNavText4Style: CSSProperties = useMemo(() => {
    return {
      flex: menuNavTextFlex,
    };
  }, [menuNavTextFlex]);

  return (
    <div
      className="rounded-mini flex flex-col items-start justify-start p-4 text-left text-base text-white-1 font-kumbh-sans"
      style={sideNavigationButtonLogoutStyle}
    >
      <div
        className="w-40 h-6 flex flex-row items-center justify-start gap-[16px]"
        style={navInnerContentContainer4Style}
      >
        <img
          className="relative w-6 h-6"
          alt=""
          src="/logouticoncontainer.svg"
        />
        <div
          className="flex-1 relative leading-[140%]"
          style={menuNavText4Style}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default SideNavigationButtonLogout;
