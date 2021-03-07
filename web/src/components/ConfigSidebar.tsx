import * as React from "react";
import { NavLink } from "react-router-dom";

export function ConfigSidebar(): JSX.Element {
  return (
    <aside className="sidebar">
      <div className="heading">ELEMENTS</div>
      <NavLink to="/manage/elements/import">Import</NavLink>
      <NavLink to="/manage/elements/batch-import">Batch import</NavLink>
      <div className="heading">MANAGE</div>
      <NavLink to="/manage/categories">Categories</NavLink>
      <NavLink to="/manage/workers">Workers</NavLink>
    </aside>
  );
}
