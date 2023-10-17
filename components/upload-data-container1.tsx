import type { NextPage } from "next";

type UploadDataContainer1Type = {
  uploadIconContainer?: string;
};

const UploadDataContainer1: NextPage<UploadDataContainer1Type> = ({
  uploadIconContainer,
}) => {
  return (
    <div className="rounded-mini bg-black-3 box-border h-14 flex flex-col items-start justify-center py-2 px-3 text-left text-xs text-white-1 font-kumbh-sans border-[1px] border-solid border-black-4">
      <div className="self-stretch h-6 flex flex-row items-center justify-start gap-[8px]">
        <img className="relative w-6 h-6" alt="" src={uploadIconContainer} />
        <div className="relative leading-[140%]">Upload Data</div>
      </div>
    </div>
  );
};

export default UploadDataContainer1;
