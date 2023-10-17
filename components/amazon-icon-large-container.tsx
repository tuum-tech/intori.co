import type { NextPage } from "next";

const AmazonIconLargeContainer: NextPage = () => {
  return (
    <div className="rounded-xl bg-black-2 w-[76px] h-[76px] overflow-hidden shrink-0 flex flex-col items-center justify-center p-2.5 box-border">
      <img
        className="relative w-[38px] h-[38px]"
        alt=""
        src="/amazonicon1.svg"
      />
    </div>
  );
};

export default AmazonIconLargeContainer;
