import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type AmazonIconContainerType = {
  /** Style props */
  amazonIconContainerFlexShrink?: CSSProperties["flexShrink"];
  amazonIconContainerWidth?: CSSProperties["width"];
  amazonIconContainerHeight?: CSSProperties["height"];
};

const AmazonIconContainer: NextPage<AmazonIconContainerType> = ({
  amazonIconContainerFlexShrink,
  amazonIconContainerWidth,
  amazonIconContainerHeight,
}) => {
  const amazonIconContainerStyle: CSSProperties = useMemo(() => {
    return {
      flexShrink: amazonIconContainerFlexShrink,
      width: amazonIconContainerWidth,
      height: amazonIconContainerHeight,
    };
  }, [
    amazonIconContainerFlexShrink,
    amazonIconContainerWidth,
    amazonIconContainerHeight,
  ]);

  return (
    <div
      className="rounded-xl bg-black-2 w-[46px] h-[46px] overflow-hidden flex flex-col items-center justify-center p-2.5 box-border"
      style={amazonIconContainerStyle}
    >
      <img
        className="relative w-[22px] h-[22px]"
        alt=""
        src="/amazonicon.svg"
      />
    </div>
  );
};

export default AmazonIconContainer;
