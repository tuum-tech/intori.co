import type { NextPage } from "next";

type AccountIconContainerType = {
  profileIconContainer?: string;
};

const AccountIconContainer: NextPage<AccountIconContainerType> = ({
  profileIconContainer,
}) => {
  return (
    <div className="rounded-3xs bg-brand-primary w-7 h-7 flex flex-row items-center justify-center p-1.5 box-border">
      <img
        className="relative w-4 h-4 overflow-hidden shrink-0"
        alt=""
        src={profileIconContainer}
      />
    </div>
  );
};

export default AccountIconContainer;
