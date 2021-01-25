import * as React from "react";
import { NavLink } from "react-router-dom";

export function ConfigSidebar(): JSX.Element {
  return (
    <aside className="sidebar">
      <div className="heading">IMPORT</div>
      <NavLink to="/import/element">Element</NavLink>
      <div className="heading">MANAGE</div>
      <NavLink to="/manage/categories">Categories</NavLink>
      <NavLink to="/manage/workers">Workers</NavLink>
    </aside>
  );
}
