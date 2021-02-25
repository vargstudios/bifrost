import * as React from "react";
import "./TextArea.scss";

type Props = {
  id?: string;
  label?: string;
  placeholder?: string;
  columns?: number;
  lines?: number;
  value: string;
  onChange: (value: string) => void;
};

export function TextArea(props: Props): JSX.Element {
  return (
    <div className="nyx textarea">
      {props.label ?? <label htmlFor={props.id}>{props.label}</label>}
      <textarea
        id={props.id}
        autoComplete="off"
        spellCheck="false"
        placeholder={props.placeholder}
        style={{
          width: `calc(${props.columns ?? 16} * 24px + 2 * var(--size-2))`,
          height: `calc(${props.lines ?? 4} * 24px + 2 * var(--size-1))`,
        }}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
    </div>
  );
}
