import * as React from "react";
import "./Button.scss";

type Props = {
  id?: string;
  label: string;
  onClick: () => void;
};

export function Button(props: Props): JSX.Element {
  return (
    <button id={props.id} className="nyx button" onClick={props.onClick}>
      {props.label}
    </button>
  );
}
