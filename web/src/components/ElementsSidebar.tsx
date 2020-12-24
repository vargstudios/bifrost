import * as React from "react";
import { Category } from "../api/categories";

type Props = {
  categories: Category[];
};

export function ElementsSidebar(props: Props): JSX.Element {
  return (
    <aside className="sidebar">
      <div className="heading">CATEGORY</div>
      <div className="button active">All</div>
      {props.categories.map((category) => (
        <div className="button" key={category.id}>
          {category.name}
        </div>
      ))}
      <div className="heading">ORDER BY</div>
      <div className="button active">Latest</div>
    </aside>
  );
}
