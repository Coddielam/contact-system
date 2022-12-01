import React from "react";

export default function DashboardLayout({
  topLeftCorner,
  topLeftSecond,
  topRightSecond,
  topRightCorner,
  mainArea,
}: {
  topLeftCorner?: JSX.Element;
  topLeftSecond?: JSX.Element;
  topRightSecond?: JSX.Element;
  topRightCorner?: JSX.Element;
  mainArea: JSX.Element;
}) {
  return (
    <div className="flex flex-col gap-7">
      <div className="grid grid-cols-12 justify-between w-full sticky top-0 bg-appbackground  bg-opacity-80 shadow-appbackground shadow-md py-3">
        <div className="col-span-3 text-left">{topLeftCorner}</div>
        <div className="col-span-3 text-left">{topLeftSecond}</div>
        <div className="col-span-3 text-right">{topRightSecond}</div>
        <div className="col-span-3 text-right">{topRightCorner}</div>
      </div>
      <div>{mainArea}</div>
    </div>
  );
}
