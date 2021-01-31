import * as React from "react";

type Props = {
  label: string;
  onClick: () => void;
};

export function Button(props: Props): JSX.Element {
  return (
    <button className="button" onClick={props.onClick}>
      {props.label}
    </button>
  );
}
