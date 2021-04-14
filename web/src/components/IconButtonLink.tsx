import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Link } from "react-router-dom";
import "./IconButton.scss";

type Props = {
  size?: "small" | "medium" | "large";
  title?: string;
  icon: IconProp;
  to: string;
};

export function IconButtonLink(props: Props): JSX.Element {
  const classes = props.size ? `icon-button ${props.size}` : "icon-button";
  return (
    <Link className={classes} title={props.title} to={props.to}>
      <FontAwesomeIcon icon={props.icon} />
    </Link>
  );
}
