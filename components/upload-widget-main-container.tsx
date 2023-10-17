import type { NextPage } from "next";
import SelectedDataValueWidget from "./selected-data-value-widget";
import ItemsSelectedWidget from "./items-selected-widget";

const UploadWidgetMainContainer: NextPage = () => {
  return (
    <div className="self-stretch flex flex-row flex-wrap items-start justify-start gap-[28px] text-left text-lg text-white-1 font-kumbh-sans">
      <SelectedDataValueWidget />
      <ItemsSelectedWidget />
    </div>
  );
};

export default UploadWidgetMainContainer;
