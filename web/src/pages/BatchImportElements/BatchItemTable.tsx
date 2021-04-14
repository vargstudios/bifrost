import * as React from "react";
import { ElementCategory } from "../../api/element-categories";
import { BatchImportElementItem } from "../../api/batch";
import { Table } from "../../nyx/Table";

type Props = {
  categories: ElementCategory[];
  items: BatchImportElementItem[];
};

export function BatchItemTable(props: Props): JSX.Element {
  function getCategory(id: string): ElementCategory | undefined {
    return props.categories.find((category) => category.id === id);
  }

  return (
    <Table
      head={
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Length</th>
          <th>Status</th>
        </tr>
      }
      body={props.items.map((item, index) => (
        <tr key={index}>
          <td>{item.element.name}</td>
          <td>{getCategory(item.element.categoryId)?.name}</td>
          <td>{item.element.framecount} Frames</td>
          <td>{item.status}</td>
        </tr>
      ))}
    />
  );
}
