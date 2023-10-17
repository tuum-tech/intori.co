import type { NextPage } from "next";

const CredentailIssuedOnWidgetBlock: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-black-1 overflow-hidden flex flex-col items-start justify-start p-6 gap-[15px] text-left text-base text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4">
      <div className="self-stretch relative font-semibold">Issued On</div>
      <div className="self-stretch flex flex-row items-center justify-between text-sm text-grey-2">
        <div className="flex-1 flex flex-col items-start justify-start">
          <div className="self-stretch relative leading-[150%]">
            01 Sep 2023
          </div>
        </div>
      </div>
    </div>
  );
};

export default CredentailIssuedOnWidgetBlock;
