import * as React from "react";

type Props = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function Textbox(props: Props): JSX.Element {
  return (
    <div className="textbox">
      <label htmlFor={props.id}>{props.label}</label>
      <input
        id={props.id}
        type="text"
        autoComplete="off"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
