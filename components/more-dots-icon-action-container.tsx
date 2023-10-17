import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type MoreDotsIconActionContainerType = {
  /** Style props */
  moreDotsIconActionContainBoxSizing?: CSSProperties["boxSizing"];
};

const MoreDotsIconActionContainer: NextPage<
  MoreDotsIconActionContainerType
> = ({ moreDotsIconActionContainBoxSizing }) => {
  const moreDotsIconActionContainerStyle: CSSProperties = useMemo(() => {
    return {
      boxSizing: moreDotsIconActionContainBoxSizing,
    };
  }, [moreDotsIconActionContainBoxSizing]);

  return (
    <div
      className="rounded-mini flex flex-col items-center justify-center p-4"
      style={moreDotsIconActionContainerStyle}
    >
      <img
        className="relative w-6 h-6"
        alt=""
        src="/moredotsiconcontainer.svg"
      />
    </div>
  );
};

export default MoreDotsIconActionContainer;
