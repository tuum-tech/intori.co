import type { NextPage } from "next";
import OverviewContentSection from "./overview-content-section";

const DashboardFullContentSection: NextPage = () => {
  return (
    <div className="self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-13xl text-white-0 font-kumbh-sans">
      <OverviewContentSection />
    </div>
  );
};

export default DashboardFullContentSection;
