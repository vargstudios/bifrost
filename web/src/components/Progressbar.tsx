import * as React from "react";

type Props = {
  current: number;
  total: number;
};

export function Progressbar(props: Props): JSX.Element {
  const ratio = props.current / props.total;
  return (
    <div className="progressbar">
      <div className="fill" style={{ width: `${ratio * 100}%` }} />
    </div>
  );
}
