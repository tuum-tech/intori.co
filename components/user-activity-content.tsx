import type { NextPage } from "next";
import WidgetTopTitleBarSideActivity from "./widget-top-title-bar-side-activity";
import UserActivity1 from "./user-activity1";
import UserActivity2 from "./user-activity2";

const UserActivityContent: NextPage = () => {
  return (
    <a className="[text-decoration:none] self-stretch rounded-mini flex flex-col items-start justify-start py-0 px-3 gap-[6px] text-left text-sm text-white-0 font-kumbh-sans">
      <WidgetTopTitleBarSideActivity />
      <UserActivity1 />
      <UserActivity2 />
    </a>
  );
};

export default UserActivityContent;
