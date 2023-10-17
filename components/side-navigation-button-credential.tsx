import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type SideNavigationButtonCredentialType = {
  credentialsIconContainer?: string;

  /** Style props */
  sideNavigationButtonCredeWidth?: CSSProperties["width"];
  sideNavigationButtonCredeBackgroundColor?: CSSProperties["backgroundColor"];
  sideNavigationButtonCredeBorder?: CSSProperties["border"];
  navInnerContentContainerWidth?: CSSProperties["width"];
  menuNavTextColor?: CSSProperties["color"];
};

const SideNavigationButtonCredential: NextPage<
  SideNavigationButtonCredentialType
> = ({
  credentialsIconContainer,
  sideNavigationButtonCredeWidth,
  sideNavigationButtonCredeBackgroundColor,
  sideNavigationButtonCredeBorder,
  navInnerContentContainerWidth,
  menuNavTextColor,
}) => {
  const sideNavigationButtonCredentialStyle: CSSProperties = useMemo(() => {
    return {
      width: sideNavigationButtonCredeWidth,
      backgroundColor: sideNavigationButtonCredeBackgroundColor,
      border: sideNavigationButtonCredeBorder,
    };
  }, [
    sideNavigationButtonCredeWidth,
    sideNavigationButtonCredeBackgroundColor,
    sideNavigationButtonCredeBorder,
  ]);

  const navInnerContentContainer1Style: CSSProperties = useMemo(() => {
    return {
      width: navInnerContentContainerWidth,
    };
  }, [navInnerContentContainerWidth]);

  const menuNavText1Style: CSSProperties = useMemo(() => {
    return {
      color: menuNavTextColor,
    };
  }, [menuNavTextColor]);

  return (
    <div
      className="rounded-mini flex flex-col items-start justify-start p-4 text-left text-base text-white-1 font-kumbh-sans"
      style={sideNavigationButtonCredentialStyle}
    >
      <div
        className="w-40 h-6 flex flex-row items-center justify-start gap-[16px]"
        style={navInnerContentContainer1Style}
      >
        <img
          className="relative w-6 h-6"
          alt=""
          src={credentialsIconContainer}
        />
        <div className="relative leading-[140%]" style={menuNavText1Style}>
          Credentials
        </div>
      </div>
    </div>
  );
};

export default SideNavigationButtonCredential;
