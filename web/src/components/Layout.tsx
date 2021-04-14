import * as React from "react";
import { useState } from "react";
import { useKeyDown } from "../hooks/useKeyDown";
import "./Layout.scss";

type Props = {
  children: React.ReactNode;
};

export function Layout(props: Props): JSX.Element {
  const [count, setCount] = useState(0);

  function handleX(event: KeyboardEvent): void {
    if (event.key === "x" || event.key === "X") {
      setCount(count + 1);
    } else {
      setCount(0);
    }
  }

  useKeyDown(handleX);

  return (
    <div className={"layout" + (count >= 3 ? " x" : "")}>{props.children}</div>
  );
}
