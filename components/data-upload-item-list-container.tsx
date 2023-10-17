import type { NextPage } from "next";
import Nodatauploads from "./nodatauploads";
import DataUploadItemDesktop from "./data-upload-item-desktop";

const DataUploadItemListContainer: NextPage = () => {
  return (
    <div className="self-stretch flex flex-col items-start justify-start gap-[15px] text-center text-xs text-white-0 font-kumbh-sans">
      <Nodatauploads />
      <DataUploadItemDesktop />
      <DataUploadItemDesktop />
      <DataUploadItemDesktop />
      <DataUploadItemDesktop />
      <DataUploadItemDesktop />
      <DataUploadItemDesktop />
      <DataUploadItemDesktop />
      <DataUploadItemDesktop />
    </div>
  );
};

export default DataUploadItemListContainer;
