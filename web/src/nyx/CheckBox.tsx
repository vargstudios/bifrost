import * as React from "react";
import "./CheckBox.scss";

type Props = {
  id?: string;
  label?: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

export function CheckBox(props: Props): JSX.Element {
  return (
    <div className="nyx checkbox">
      <input
        id={props.id}
        type="checkbox"
        checked={props.value}
        onChange={(e) => props.onChange(e.target.checked)}
      />
      <div className="box" />
      {props.label && <label htmlFor={props.id}>{props.label}</label>}
    </div>
  );
}
