import type { NextPage } from "next";
import EnterEmailInput from "./enter-email-input";

const MainInputContainer: NextPage = () => {
  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-[10px] text-left text-sm text-white-0 font-kumbh-sans">
      <div className="self-stretch flex flex-row items-start justify-start py-2.5 pr-2.5 pl-0">
        <div className="flex-1 relative font-medium">Email</div>
      </div>
      <EnterEmailInput />
    </div>
  );
};

export default MainInputContainer;
