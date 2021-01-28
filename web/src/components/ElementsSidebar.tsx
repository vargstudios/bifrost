import * as React from "react";
import { NavLink } from "react-router-dom";
import { Category } from "../api/categories";
import { useQuery } from "../hooks/useQuery";

type Props = {
  categories: Category[];
};

export function ElementsSidebar(props: Props): JSX.Element {
  const query = useQuery();

  return (
    <aside className="sidebar">
      <div className="heading">CATEGORY</div>
      <NavLink
        to={query.del("category").toString()}
        isActive={() => query.has("category", null)}
      >
        All
      </NavLink>
      {props.categories
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((category) => (
          <NavLink
            to={query.set("category", category.id).toString()}
            isActive={() => query.has("category", category.id)}
            key={category.id}
          >
            {category.name}
          </NavLink>
        ))}
    </aside>
  );
}
