import type { NextPage } from "next";
import SearchBar from "./search-bar";

const LeftTopNavContainer: NextPage = () => {
  return (
    <div className="flex-1 flex flex-row items-center justify-start gap-[24px]">
      <div className="rounded-mini hidden flex-col items-center justify-center p-4 md:flex">
        <img
          className="relative w-6 h-6 overflow-hidden shrink-0"
          alt=""
          src="/mobileburgermenuiconcontainer.svg"
        />
      </div>
      <SearchBar />
    </div>
  );
};

export default LeftTopNavContainer;
