import type { NextPage } from "next";

const Nodatauploads: NextPage = () => {
  return (
    <div className="rounded-mini w-[1004px] hidden flex-row items-start justify-start py-3 px-0 box-border text-center text-xs text-white-0 font-kumbh-sans">
      <div className="flex-1 overflow-hidden flex flex-row items-center justify-center py-0 pr-[7px] pl-0">
        <div className="flex-1 overflow-hidden flex flex-row items-center justify-center py-0 pr-[7px] pl-0 box-border max-w-[500px]">
          <div className="flex-1 overflow-hidden flex flex-col items-center justify-center">
            <div className="relative font-semibold">No Data Uploads Found</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nodatauploads;
