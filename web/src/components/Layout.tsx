import * as React from "react";
import { useState } from "react";
import "./Layout.scss";

type Props = {
  onEscape?: () => void;
  children: React.ReactNode;
};

export function Layout(props: Props): JSX.Element {
  const [count, setCount] = useState(0);

  function handleX(event: React.KeyboardEvent): void {
    if (event.key === "x" || event.key === "X") {
      setCount(count + 1);
    } else {
      setCount(0);
    }
  }

  return (
    <div className={"layout" + (count >= 3 ? " x" : "")} onKeyDown={handleX}>
      {props.children}
    </div>
  );
}
