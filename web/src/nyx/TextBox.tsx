import * as React from "react";
import "./TextBox.scss";

type Props = {
  id: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
};

export function TextBox(props: Props): JSX.Element {
  return (
    <div className="nyx textbox">
      {props.label ?? <label htmlFor={props.id}>{props.label}</label>}
      <input
        id={props.id}
        type="text"
        autoComplete="off"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
