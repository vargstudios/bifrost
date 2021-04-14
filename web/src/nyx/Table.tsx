import * as React from "react";
import "./Table.scss";

type Props = {
  head?: React.ReactElement;
  body: React.ReactElement | React.ReactElement[];
  foot?: React.ReactElement;
};

export function Table(props: Props): JSX.Element {
  return (
    <table className="nyx table">
      <thead>{props.head}</thead>
      <tbody>{props.body}</tbody>
      <tfoot>{props.foot}</tfoot>
    </table>
  );
}
