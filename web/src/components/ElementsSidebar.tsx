import * as React from "react";
import { NavLink } from "react-router-dom";
import { Category } from "../api/categories";

type Props = {
  categories: Category[];
};

export function ElementsSidebar(props: Props): JSX.Element {
  return (
    <aside className="sidebar">
      <div className="heading">CATEGORY</div>
      <NavLink to="/browse/elements">All</NavLink>
      {props.categories.map((category) => (
        <NavLink to="/browse/elements/category" key={category.id}>
          {category.name}
        </NavLink>
      ))}
      <div className="heading">ORDER BY</div>
      <NavLink to="/browse/elements/latest">Latest</NavLink>
    </aside>
  );
}
