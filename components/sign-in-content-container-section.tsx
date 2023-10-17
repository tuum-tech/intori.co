import type { NextPage } from "next";
import SignInSectionContainer from "./sign-in-section-container";

const SignInContentContainerSection: NextPage = () => {
  return (
    <div className="self-stretch flex-1 flex flex-col items-center justify-center py-10 px-3 box-border max-w-[400px] h-screen text-center text-11xl text-white-0 font-kumbh-sans lg:h-screen md:gap-[0px] md:items-center md:justify-center md:pl-0 md:pr-0 md:box-border md:max-w-[450px] md:h-screen sm:w-full sm:flex-col sm:gap-[5px] sm:items-center sm:justify-center sm:pl-0 sm:pt-10 sm:pr-0 sm:box-border sm:max-w-[450px] sm:h-screen Small_Tablet:pl-0 Small_Tablet:pr-0 Small_Tablet:box-border">
      <SignInSectionContainer />
    </div>
  );
};

export default SignInContentContainerSection;
