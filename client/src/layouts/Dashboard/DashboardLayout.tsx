import React from "react";

export default function DashboardLayout({
  topLeftCorner,
  topLeftSecond,
  topCenter,
  topRightSecond,
  topRightCorner,
  mainArea,
}: {
  topLeftCorner?: JSX.Element;
  topLeftSecond?: JSX.Element;
  topCenter?: JSX.Element;
  topRightSecond?: JSX.Element;
  topRightCorner?: JSX.Element;
  mainArea: JSX.Element;
}) {
  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-10 w-full sticky top-0 bg-appbackground  bg-opacity-80 shadow-appbackground shadow-md py-3 justify-items-end items-center">
        <div className="col-span-2 text-left">{topLeftCorner}</div>
        <div className="col-span-2 text-left">{topLeftSecond}</div>
        <div className="col-span-2 text-left">{topCenter}</div>
        <div className="col-span-2 text-right">{topRightSecond}</div>
        <div className="col-span-2 text-right">{topRightCorner}</div>
      </div>
      <div>{mainArea}</div>
    </div>
  );
}
