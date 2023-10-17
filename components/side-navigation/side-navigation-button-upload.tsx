import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type SideNavigationButtonUploadType = {
  uploadIconContainer?: string;

  /** Style props */
  sideNavigationButtonUploaWidth?: CSSProperties["width"];
  sideNavigationButtonUploaBackgroundColor?: CSSProperties["backgroundColor"];
  sideNavigationButtonUploaBorder?: CSSProperties["border"];
  navInnerContentContainerWidth?: CSSProperties["width"];
  menuNavTextColor?: CSSProperties["color"];
};

const SideNavigationButtonUpload: NextPage<SideNavigationButtonUploadType> = ({
  uploadIconContainer,
  sideNavigationButtonUploaWidth,
  sideNavigationButtonUploaBackgroundColor,
  sideNavigationButtonUploaBorder,
  navInnerContentContainerWidth,
  menuNavTextColor,
}) => {
  const sideNavigationButtonUploadStyle: CSSProperties = useMemo(() => {
    return {
      width: sideNavigationButtonUploaWidth,
      backgroundColor: sideNavigationButtonUploaBackgroundColor,
      border: sideNavigationButtonUploaBorder,
    };
  }, [
    sideNavigationButtonUploaWidth,
    sideNavigationButtonUploaBackgroundColor,
    sideNavigationButtonUploaBorder,
  ]);

  const navInnerContentContainer2Style: CSSProperties = useMemo(() => {
    return {
      width: navInnerContentContainerWidth,
    };
  }, [navInnerContentContainerWidth]);

  const menuNavText2Style: CSSProperties = useMemo(() => {
    return {
      color: menuNavTextColor,
    };
  }, [menuNavTextColor]);

  return (
    <div
      className="rounded-mini flex flex-col items-start justify-start p-4 text-left text-base text-white-1 font-kumbh-sans"
      style={sideNavigationButtonUploadStyle}
    >
      <div
        className="w-40 h-6 flex flex-row items-center justify-start gap-[16px]"
        style={navInnerContentContainer2Style}
      >
        <img className="relative w-6 h-6" alt="" src={uploadIconContainer} />
        <div className="relative leading-[140%]" style={menuNavText2Style}>
          Upload
        </div>
      </div>
    </div>
  );
};

export default SideNavigationButtonUpload;
