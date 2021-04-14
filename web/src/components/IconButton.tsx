import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import "./IconButton.scss";

type Props = {
  size?: "small" | "medium" | "large";
  title?: string;
  icon: IconProp;
  onClick: () => void;
};

export function IconButton(props: Props): JSX.Element {
  const classes = props.size ? `icon-button ${props.size}` : "icon-button";
  return (
    <button className={classes} title={props.title} onClick={props.onClick}>
      <FontAwesomeIcon icon={props.icon} />
    </button>
  );
}
