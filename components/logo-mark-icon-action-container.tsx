import type { NextPage } from "next";

type LogoMarkIconActionContainerType = {
  intoriLogoMark?: string;
};

const LogoMarkIconActionContainer: NextPage<
  LogoMarkIconActionContainerType
> = ({ intoriLogoMark }) => {
  return (
    <div className="rounded-mini w-14 h-14 flex flex-col items-center justify-center p-4 box-border">
      <img className="relative w-[26px] h-[35px]" alt="" src={intoriLogoMark} />
    </div>
  );
};

export default LogoMarkIconActionContainer;
