import * as React from "react";
import "./Column.scss";

type Props = {
  children: React.ReactNode;
};

export function Column(props: Props): JSX.Element {
  return <div className="nyx column">{props.children}</div>;
}
