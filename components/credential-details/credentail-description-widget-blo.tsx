import type { NextPage } from "next";

const CredentailDescriptionWidgetBlo: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4">
      <div className="self-stretch relative font-semibold">
        Credential Description
      </div>
      <div className="self-stretch flex flex-row items-center justify-between text-sm text-grey-2">
        <div className="flex-1 flex flex-col items-start justify-start">
          <div className="self-stretch relative leading-[150%]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Commodo
            pellentesque massa tellus ac augue. Lectus arcu at in in rhoncus
            malesuada ipsum turpis. Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Commodo pellentesque massa tellus ac augue. Lectus arcu at in
            in rhoncus malesuada ipsum turpis. Lorem ipsum dolor sit amet,
            consectetur adipiscing elit.
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentailDescriptionWidgetBlo;
