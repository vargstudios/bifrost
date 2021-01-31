import * as React from "react";

type Option = {
  name: string;
  value: string;
};

type Props = {
  id: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export function Selectbox(props: Props): JSX.Element {
  return (
    <div className="selectbox">
      <label htmlFor={props.id}>{props.label}</label>
      <select
        id={props.id}
        autoComplete="off"
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      >
        {props.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
