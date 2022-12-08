import React from "react";
import { TbRobotOff } from "react-icons/tb";

const FallBackUI = () => {
  return (
    <div className="bg-appbackground w-screen h-screen overflow-scroll flex flex-col gap-3 justify-center items-center">
      <TbRobotOff className="w-32 h-32" />
      <p className="max-w-md text-center">
        Something went wrong! <br />
        Click the button to return to home page.
      </p>
      <a
        href="/"
        className="bg-blue-400 px-4 py-1 text-base rounded-md shadow-md text-slate-100"
      >
        Return home
      </a>
    </div>
  );
};

export class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    console.log(error);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <FallBackUI />;
    }

    return this.props.children;
  }
}
