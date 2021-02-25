import * as React from "react";
import "./Dialog.css";

type Props = {
  children: JSX.Element;
};

export function Dialog(props: Props): JSX.Element {
  return (
    <div className="nyx dialog">
      <div className="backdrop" />
      <div className="window">{props.children}</div>
    </div>
  );
}
