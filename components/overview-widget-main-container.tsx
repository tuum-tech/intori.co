import type { NextPage } from "next";
import PortfolioValueWidget from "./portfolio-value-widget";
import TotalCredentialsWidget from "./total-credentials-widget";

const OverviewWidgetMainContainer: NextPage = () => {
  return (
    <div className="self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans">
      <PortfolioValueWidget />
      <TotalCredentialsWidget />
    </div>
  );
};

export default OverviewWidgetMainContainer;
