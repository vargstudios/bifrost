import * as React from "react";
import "./Link.scss";

type Props = {
  href: string;
  text: string;
};

export function Link(props: Props): JSX.Element {
  return (
    <a className="nyx link" href={props.href}>
      {props.text}
    </a>
  );
}
