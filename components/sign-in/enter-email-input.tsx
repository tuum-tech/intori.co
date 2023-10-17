import type { NextPage } from "next";

const EnterEmailInput: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini box-border h-14 flex flex-row items-center justify-start pt-[15px] pb-4 pr-[25px] pl-5 text-left text-sm text-grey-1 font-kumbh-sans border-[1px] border-solid border-black-4">
      <div className="relative font-medium">Enter your email</div>
    </div>
  );
};

export default EnterEmailInput;
