import type { NextPage } from "next";
import AmazonIconContainer from "./amazon-icon-container";
import MoreDotsIconActionContainer from "./more-dots-icon-action-container";

const UserCredentialDesktop: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini flex flex-row items-start justify-start py-3 px-6 gap-[31px] text-left text-xs text-white-0 font-kumbh-sans">
      <div className="flex-1 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0">
        <div className="flex-1 overflow-hidden flex flex-row items-center justify-start py-0 pr-[7px] pl-0 box-border gap-[20px] max-w-[500px]">
          <AmazonIconContainer
            amazonIconContainerFlexShrink="0"
            amazonIconContainerWidth="56px"
            amazonIconContainerHeight="56px"
          />
          <div className="flex-1 overflow-hidden flex flex-col items-start justify-center gap-[5px]">
            <div className="relative font-semibold">Order Credential</div>
            <div className="self-stretch relative text-white-1">Amazon</div>
          </div>
        </div>
      </div>
      <div className="w-[333px] flex flex-row items-center justify-between text-white-1 Small_Tablet:flex">
        <div className="relative inline-block w-[70px] shrink-0">$0.01</div>
        <div className="relative inline-block w-[90px] shrink-0">
          21 Aug 2021
        </div>
        <div className="relative inline-block w-[90px] shrink-0">
          01 Sep 2024
        </div>
        <MoreDotsIconActionContainer moreDotsIconActionContainBoxSizing="border-box" />
      </div>
    </div>
  );
};

export default UserCredentialDesktop;
