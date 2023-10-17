import type { NextPage } from "next";

const PortfolioValueWidget: NextPage = () => {
  return (
    <div className="flex-1 rounded-mini bg-black-1 box-border flex flex-col items-start justify-start py-12 pr-[47px] pl-12 gap-[24px] min-w-[300px] text-left text-lg text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4">
      <div className="self-stretch rounded-boundvariablesdata2 flex flex-row flex-wrap items-center justify-start">
        <div className="flex-1 rounded-boundvariablesdata2 flex flex-col items-start justify-center">
          <div className="self-stretch relative leading-[20px] inline-block h-5 shrink-0">
            Portfolio Value
          </div>
        </div>
      </div>
      <div className="self-stretch rounded-boundvariablesdata2 flex flex-row flex-wrap items-center justify-between text-19xl text-white-0">
        <div className="rounded-boundvariablesdata2 flex flex-col items-start justify-center">
          <div className="self-stretch relative leading-[36px] font-light">
            $0.00
          </div>
        </div>
        <div className="rounded-boundvariablesdata2 flex flex-row flex-wrap items-center justify-start text-sm">
          <div className="rounded-boundvariablesdata2 flex flex-col items-start justify-center">
            <div className="self-stretch relative leading-[18px]">+0.00%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioValueWidget;
