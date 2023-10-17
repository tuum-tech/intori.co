import type { NextPage } from "next";
import CredentailDetailsContentSectio from "./credentail-details-content-sectio";

const CredDetailsFullContentSection: NextPage = () => {
  return (
    <div className="self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-left text-base text-white-1 font-kumbh-sans">
      <CredentailDetailsContentSectio />
    </div>
  );
};

export default CredDetailsFullContentSection;
