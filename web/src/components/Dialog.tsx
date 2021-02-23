import * as React from "react";

type Props = {
  children: JSX.Element;
};

export function Dialog(props: Props): JSX.Element {
  return (
    <div className="dialog">
      <div className="backdrop" />
      <div className="window">{props.children}</div>
    </div>
  );
}
