import * as React from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { IconButtonLink } from "./IconButtonLink";

export function Header(): JSX.Element {
  return (
    <header>
      <Link to="/" className="title">
        BIFROST
      </Link>
      <IconButtonLink to="/import/element" size="large" icon={faCog} />
    </header>
  );
}
