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
  ElementCategoryWithCount,
  listCategories,
} from "../api/element-categories";
import { TextBox } from "../nyx/TextBox";
import { faPencilAlt, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button } from "../nyx/Button";
import { IconButton } from "../components/IconButton";
import { Error } from "../api/error";
import { Layout } from "../components/Layout";
import { EditCategoryDialog } from "../components/EditCategoryDialog";
import { Column } from "../nyx/Column";

export function ManageCategoriesPage(): JSX.Element {
  const [categories, setCategories] = useState<ElementCategoryWithCount[]>([]);
  const [state, setState] = useState<CreateElementCategory>({ name: "" });
  const [editCategory, setEditCategory] = useState<ElementCategory>();

  useEffect(loadCategories, []);

  function loadCategories(): void {
    listCategories()
      .then(setCategories)
      .catch((error: Error) => alert("Load error: " + error.details));
  }

  function onCreateClicked(): void {
    createCategory(state)
      .then(() => setState({ name: "" }))
      .then(loadCategories)
      .catch((error: Error) => alert("Create error: " + error.details));
  }

  function onDeleteClicked(id: string): void {
    deleteCategory(id)
      .then(loadCategories)
      .catch((error: Error) => alert("Delete error: " + error.details));
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
          {categories
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>{category.elements}</td>
                <td>
                  <IconButton
                    size="small"
                    title="Rename"
                    icon={faPencilAlt}
                    onClick={() => setEditCategory(category)}
                  />
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

  function renameCategoryDialog(): JSX.Element | null {
    if (!editCategory) {
      return null;
    }
    return (
      <EditCategoryDialog
        category={editCategory}
        onSaved={() => {
          loadCategories();
          setEditCategory(undefined);
        }}
        onCancel={() => setEditCategory(undefined)}
      />
    );
  }

  return (
    <Layout>
      <Header />
      <ConfigSidebar />
      <main className="mainlayout">
        <Column>
          <h2>CREATE CATEGORY</h2>
          <TextBox
            id="name"
            label="Name"
            value={state.name}
            onChange={(value) => setState({ ...state, name: value })}
          />
          <Button label="Create" onClick={onCreateClicked} />
          <h2>ALL CATEGORIES</h2>
          {categoryTable()}
        </Column>
      </main>
      <Footer />
      {renameCategoryDialog()}
    </Layout>
  );
}
