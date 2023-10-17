import type { NextPage } from "next";
import CredentialsContentSection from "./credentials-content-section";

const CredentialsFullContentSection: NextPage = () => {
  return (
    <div className="self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-lg text-white-1 font-kumbh-sans">
      <CredentialsContentSection />
    </div>
  );
};

export default CredentialsFullContentSection;
