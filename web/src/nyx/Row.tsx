import * as React from "react";
import "./Row.scss";

type Props = {
  children: React.ReactNode;
};

export function Row(props: Props): JSX.Element {
  return <div className="nyx row">{props.children}</div>;
}
