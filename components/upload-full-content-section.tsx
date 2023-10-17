import type { NextPage } from "next";
import UploadContentSection from "./upload-content-section";

const UploadFullContentSection: NextPage = () => {
  return (
    <div className="self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-lg text-white-1 font-kumbh-sans">
      <UploadContentSection />
    </div>
  );
};

export default UploadFullContentSection;
