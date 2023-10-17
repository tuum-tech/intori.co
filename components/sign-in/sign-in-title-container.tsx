import type { NextPage } from "next";

const SignInTitleContainer: NextPage = () => {
  return (
    <div className="self-stretch flex flex-col items-center justify-start gap-[12px] text-center text-11xl text-white-0 font-kumbh-sans">
      <div className="self-stretch relative font-semibold">
        Sign in to Intori
      </div>
      <div className="w-full relative text-sm leading-[22px] font-light text-white-1 inline-block max-w-[300px]">
        Get paid for what you already do and earn from online activity.
      </div>
    </div>
  );
};

export default SignInTitleContainer;
