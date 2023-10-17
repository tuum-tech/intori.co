import type { NextPage } from "next";

const WelcomeHeaderContentContainer: NextPage = () => {
  return (
    <div className="self-stretch h-14 flex flex-col items-start justify-center text-left text-13xl text-white-0 font-kumbh-sans md:pl-3 md:box-border">
      <div className="flex flex-row items-center justify-start Small_Tablet:flex">
        <h1 className="m-0 relative text-inherit font-semibold font-inherit Small_Tablet:flex">
          Welcome
        </h1>
      </div>
    </div>
  );
};

export default WelcomeHeaderContentContainer;
