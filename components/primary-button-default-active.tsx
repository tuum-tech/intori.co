import type { NextPage } from "next";

const PrimaryButtonDefaultActive: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini bg-primary h-14 flex flex-row items-center justify-center py-[9px] px-3.5 box-border text-center text-lg text-black-1 font-kumbh-sans">
      <div className="relative leading-[18px] font-semibold">Sign in</div>
    </div>
  );
};

export default PrimaryButtonDefaultActive;
