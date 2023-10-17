import type { NextPage } from "next";
import DropdownEarningsContainer from "./dropdown-earnings-container";

const YourEarningsWidget: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-1 box-border h-[200px] flex flex-col items-start justify-start pt-6 pb-12 pr-6 pl-12 gap-[24px] min-w-[300px] text-left text-lg text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4">
      <div className="self-stretch rounded-boundvariablesdata2 flex flex-row items-center justify-start">
        <div className="flex-1 rounded-boundvariablesdata2 flex flex-row items-center justify-between">
          <div className="flex-1 relative leading-[20px] inline-block h-5">
            Earnings
          </div>
          <DropdownEarningsContainer />
        </div>
      </div>
      <div className="self-stretch rounded-boundvariablesdata2 flex flex-row items-center justify-between text-36xl text-white-0">
        <div className="rounded-boundvariablesdata2 flex flex-col items-start justify-center">
          <div className="self-stretch relative font-light">$0.00</div>
        </div>
        <div className="self-stretch rounded-boundvariablesdata2 flex flex-row items-center justify-start text-sm">
          <div className="rounded-boundvariablesdata2 flex flex-col items-start justify-center">
            <div className="self-stretch relative leading-[18px]">+0.00%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YourEarningsWidget;
