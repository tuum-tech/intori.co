import type { NextPage } from "next";
import SignInContentContainerSection from "./sign-in-content-container-section";

const SignInDefaultFullContainer: NextPage = () => {
  return (
    <div className="self-stretch flex-1 overflow-hidden flex flex-row items-center justify-center h-screen text-center text-11xl text-white-0 font-kumbh-sans lg:flex-row md:flex-row sm:items-center sm:justify-center">
      <SignInContentContainerSection />
    </div>
  );
};

export default SignInDefaultFullContainer;
