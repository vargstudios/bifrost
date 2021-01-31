import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export function Header(): JSX.Element {
  return (
    <header>
      <Link to="/" className="title">
        BIFROST
      </Link>
      <Link to="/import/element" className="button">
        <FontAwesomeIcon icon={faCog} size="2x" />
      </Link>
    </header>
  );
}
