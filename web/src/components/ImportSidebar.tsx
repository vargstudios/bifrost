import * as React from "react";

export function ImportSidebar(): JSX.Element {
  return (
    <aside className="sidebar">
      <div className="heading">IMPORT</div>
      <div className="button active">Element</div>
      <div className="heading">MANAGE</div>
      <div className="button">Categories</div>
      <div className="button">Users</div>
    </aside>
  );
}
