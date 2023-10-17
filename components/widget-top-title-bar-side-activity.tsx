import type { NextPage } from "next";
import ViewAllButtonNullContainer from "./view-all-button-null-container";

const WidgetTopTitleBarSideActivity: NextPage = () => {
  return (
    <div className="self-stretch h-14 flex flex-row items-center justify-start gap-[20px] text-left text-3xl text-white-0 font-kumbh-sans">
      <div className="self-stretch flex-1 flex flex-row items-center justify-start Small_Tablet:flex">
        <h1 className="m-0 relative text-inherit font-semibold font-inherit Small_Tablet:hidden">
          Activity
        </h1>
      </div>
      <ViewAllButtonNullContainer arrowStyleRightIconContai="/arrowstylerighticoncontainer1.svg" />
    </div>
  );
};

export default WidgetTopTitleBarSideActivity;
