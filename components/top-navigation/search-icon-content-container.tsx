import type { NextPage } from "next";

const SearchIconContentContainer: NextPage = () => {
  return (
    <div className="h-6 flex flex-row items-center justify-start gap-[5px] text-left text-base text-grey-1 font-kumbh-sans self-stretch">
      <img className="relative w-6 h-6" alt="" src="/searchiconcontainer.svg" />
      <div className="relative leading-[140%] lg:hidden">Search</div>
    </div>
  );
};

export default SearchIconContentContainer;
