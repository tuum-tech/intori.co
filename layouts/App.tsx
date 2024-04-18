import React from 'react'
import TopNavigationMenu from "@/components/top-navigation/TopNavigationMenu";
import SideNavigationMenu from "../components/side-navigation/SideNavigationMenu";

type Props = {
  title: string
  children: React.ReactNode
}

export const AppLayout: React.FC<Props> = ({ title, children }) => {
    return (
      <div className="relative bg-black-0 w-full h-screen overflow-y-auto flex flex-row items-start justify-start text-left text-base text-white font-kumbh-sans">
        <SideNavigationMenu />
        <div className="self-stretch flex-1 overflow-y-auto flex flex-col items-center justify-start p-6 text-xs">
          <div className="w-full flex flex-col items-start justify-start pt-0 px-0 pb-[50px] box-border gap-[24px] max-w-[1100px]">
            <TopNavigationMenu />
            <div className="self-stretch h-14 flex flex-col items-start justify-center text-13xl md:pl-3 md:box-border">
              <div className="flex flex-row items-center justify-start Small_Tablet:flex">
                <h1 className="m-0 relative text-inherit font-semibold font-inherit Small_Tablet:flex">
                  { title }
                </h1>
              </div>
            </div>
            <div className="self-stretch flex flex-row items-start justify-start gap-[24px] text-lg md:flex-col">
              { children }
            </div>
          </div>
        </div>
      </div>
    )
}

