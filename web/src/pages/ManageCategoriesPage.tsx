import * as React from "react";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConfigSidebar } from "../components/ConfigSidebar";
import {
  createCategory,
  CreateElementCategory,
  deleteCategory,
  ElementCategory,
  listCategories,
} from "../api/element-categories";
import { Textbox } from "../components/Textbox";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../components/Button";
import { IconButton } from "../components/IconButton";
import { Error } from "../api/error";

export function ManageCategoriesPage(): JSX.Element {
  const [categories, setCategories] = useState<ElementCategory[]>([]);
  const [state, setState] = useState<CreateElementCategory>({ name: "" });

  useEffect(updateCategories, []);

  function updateCategories(): void {
    listCategories()
      .then(setCategories)
      .catch(() => alert("Failed to list categories")); // TODO
  }

  function onCreateClicked(): void {
    createCategory(state)
      .then(updateCategories)
      .then(() => setState({ name: "" }))
      .catch((error: Error) => alert("Creation error: " + error.details));
  }

  function onDeleteClicked(id: string): void {
    deleteCategory(id)
      .then(updateCategories)
      .catch((error: Error) => alert("Deletion error: " + error.details));
  }

  function categoryTable(): JSX.Element {
    if (categories.length < 1) {
      return <div>No categories</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Elements</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>{category.elements}</td>
              <td>
                <IconButton
                  size="small"
                  title="Delete"
                  icon={faTrash}
                  onClick={() => onDeleteClicked(category.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div className="layout">
      <Header />
      <ConfigSidebar />
      <main className="import">
        <div className="title">CREATE CATEGORY</div>
        <Textbox
          id="name"
          label="Name"
          value={state.name}
          onChange={(value) => setState({ ...state, name: value })}
        />
        <Button label="Create" onClick={onCreateClicked} />
        <div className="title">ALL CATEGORIES</div>
        {categoryTable()}
      </main>
      <Footer />
    </div>
  );
}
