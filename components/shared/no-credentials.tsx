import type { NextPage } from "next";

const NoCredentials: NextPage = () => {
  return (
    <div className="self-stretch rounded-mini hidden flex-row items-start justify-start py-3 px-0 text-center text-xs text-white-0 font-kumbh-sans">
      <div className="flex-1 overflow-hidden flex flex-row items-center justify-center py-0 pr-[7px] pl-0">
        <div className="flex-1 overflow-hidden flex flex-row items-center justify-center py-0 pr-[7px] pl-0 box-border max-w-[500px]">
          <div className="flex-1 overflow-hidden flex flex-col items-center justify-center">
            <div className="relative font-semibold">No Credentials Found</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoCredentials;
