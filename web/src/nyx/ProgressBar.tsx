import * as React from "react";
import "./ProgressBar.scss";

type Props = {
  current: number;
  total: number;
};

export function ProgressBar(props: Props): JSX.Element {
  const ratio = props.current / props.total;
  return (
    <div className="nyx progressbar">
      <div className="fill" style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}
