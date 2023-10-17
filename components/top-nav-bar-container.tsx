import type { NextPage } from "next";
import LeftTopNavContainer from "./left-top-nav-container";
import NotificationIconActiveContaine from "./notification-icon-active-containe";
import ProfileAvatarActionContainer from "./profile-avatar-action-container";

const TopNavBarContainer: NextPage = () => {
  return (
    <div className="self-stretch flex flex-row items-center justify-start gap-[48px]">
      <LeftTopNavContainer />
      <NotificationIconActiveContaine />
      <ProfileAvatarActionContainer />
    </div>
  );
};

export default TopNavBarContainer;
