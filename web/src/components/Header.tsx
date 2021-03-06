import * as React from "react";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { IconButtonLink } from "./IconButtonLink";
import "./Header.scss";
// @ts-ignore
import logo from "../logo.svg";

export function Header(): JSX.Element {
  return (
    <header>
      <Link to="/" className="title">
        <img className="logo" src={logo} alt="" />
        <span className="text">BIFROST</span>
      </Link>
      <div className="expand" />
      <IconButtonLink to="/import/element" size="large" icon={faCog} />
    </header>
  );
}
