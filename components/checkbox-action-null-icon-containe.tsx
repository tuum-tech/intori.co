import type { NextPage } from "next";
import { useMemo, type CSSProperties } from "react";

type CheckboxActionNullIconContaineType = {
  /** Style props */
  checkboxActionNullIconConBoxSizing?: CSSProperties["boxSizing"];
};

const CheckboxActionNullIconContaine: NextPage<
  CheckboxActionNullIconContaineType
> = ({ checkboxActionNullIconConBoxSizing }) => {
  const checkboxActionNullIconContaineStyle: CSSProperties = useMemo(() => {
    return {
      boxSizing: checkboxActionNullIconConBoxSizing,
    };
  }, [checkboxActionNullIconConBoxSizing]);

  return (
    <div
      className="rounded-mini flex flex-col items-center justify-center p-4"
      style={checkboxActionNullIconContaineStyle}
    >
      <div className="h-6 flex flex-row items-center justify-start">
        <div className="relative w-6 h-6">
          <div className="absolute h-full w-full top-[0%] right-[0%] bottom-[0%] left-[0%] rounded-md bg-black-2 box-border border-[1.5px] border-solid border-black-4" />
        </div>
      </div>
    </div>
  );
};

export default CheckboxActionNullIconContaine;
