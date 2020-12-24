import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export function Header(): JSX.Element {
  return (
    <header>
      <Link to="/" className="title">
        BIFROST
      </Link>
      <Link to="/user" className="button">
        <FontAwesomeIcon icon={faUser} size="2x" />
      </Link>
      <Link to="/import/element" className="button">
        <FontAwesomeIcon icon={faCog} size="2x" />
      </Link>
    </header>
  );
}
