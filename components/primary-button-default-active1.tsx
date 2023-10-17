import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type PrimaryButtonDefaultActive1Type = {
  buttonTitle?: string;

  /** Style props */
  primaryButtonDefaultActivAlignSelf?: CSSProperties["alignSelf"];
  primaryButtonDefaultActivWidth?: CSSProperties["width"];
  primaryButtonDefaultActivBorder?: CSSProperties["border"];
  primaryButtonDefaultActivMaxWidth?: CSSProperties["maxWidth"];
  buttonTitleColor?: CSSProperties["color"];
};

const PrimaryButtonDefaultActive1: NextPage<
  PrimaryButtonDefaultActive1Type
> = ({
  buttonTitle,
  primaryButtonDefaultActivAlignSelf,
  primaryButtonDefaultActivWidth,
  primaryButtonDefaultActivBorder,
  primaryButtonDefaultActivMaxWidth,
  buttonTitleColor,
}) => {
  const primaryButtonDefaultActiveStyle: CSSProperties = useMemo(() => {
    return {
      alignSelf: primaryButtonDefaultActivAlignSelf,
      width: primaryButtonDefaultActivWidth,
      border: primaryButtonDefaultActivBorder,
      maxWidth: primaryButtonDefaultActivMaxWidth,
    };
  }, [
    primaryButtonDefaultActivAlignSelf,
    primaryButtonDefaultActivWidth,
    primaryButtonDefaultActivBorder,
    primaryButtonDefaultActivMaxWidth,
  ]);

  const buttonTitleStyle: CSSProperties = useMemo(() => {
    return {
      color: buttonTitleColor,
    };
  }, [buttonTitleColor]);

  return (
    <div
      className="rounded-mini bg-primary h-14 flex flex-row items-center justify-center py-[9px] px-3.5 box-border text-center text-lg text-black-0 font-kumbh-sans self-stretch"
      style={primaryButtonDefaultActiveStyle}
    >
      <div
        className="relative leading-[18px] font-semibold"
        style={buttonTitleStyle}
      >
        {buttonTitle}
      </div>
    </div>
  );
};

export default PrimaryButtonDefaultActive1;
