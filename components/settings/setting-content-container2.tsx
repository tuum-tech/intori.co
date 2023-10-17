import type { NextPage } from "next";

const SettingContentContainer2: NextPage = () => {
  return (
    <div className="flex-1 flex flex-col items-start justify-start gap-[6px] text-left text-base text-white-0 font-kumbh-sans">
      <div className="self-stretch relative font-semibold">Theme</div>
      <div className="self-stretch relative text-xs text-white-1">
        Choose light or dark mode.
      </div>
    </div>
  );
};

export default SettingContentContainer2;
