import type { NextPage } from "next";
import PrimaryButtonDefaultActive from "./primary-button-default-active";

const BottomSignInSectionContainer: NextPage = () => {
  return (
    <div className="self-stretch flex flex-col items-center justify-center text-center text-lg text-black-1 font-kumbh-sans">
      <div className="self-stretch flex flex-col items-start justify-start">
        <PrimaryButtonDefaultActive />
      </div>
    </div>
  );
};

export default BottomSignInSectionContainer;
