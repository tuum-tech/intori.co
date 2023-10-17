import type { NextPage } from "next";

const WidgetTitleHeaderContainer: NextPage = () => {
  return (
    <div className="self-stretch flex-1 flex flex-row items-center justify-start text-left text-3xl text-white-0 font-kumbh-sans Small_Tablet:flex">
      <h1 className="m-0 relative text-inherit font-semibold font-inherit Small_Tablet:flex">
        Current data upload
      </h1>
    </div>
  );
};

export default WidgetTitleHeaderContainer;
