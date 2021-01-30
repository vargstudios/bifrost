import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConfigSidebar } from "../components/ConfigSidebar";
import {
  Category,
  createCategory,
  CreateCategory,
  deleteCategory,
  listCategories,
} from "../api/categories";
import { Textbox } from "../components/Textbox";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export function ManageCategoriesPage(props: RouteComponentProps): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [state, setState] = useState<CreateCategory>({ name: "" });

  useEffect(() => {
    listCategories().then(setCategories);
  }, []);

  function onCreateClicked(): void {
    createCategory(state)
      .then(() => {
        listCategories().then(setCategories);
        setState({ name: "" });
      })
      // TODO
      .catch(() => alert("Failed to create category"));
  }

  function onDeleteClicked(id: string): void {
    deleteCategory(id)
      .then(() => {
        listCategories().then(setCategories);
      })
      // TODO
      .catch(() => alert("Failed to delete category"));
  }

  function categoryTable(): JSX.Element {
    if (categories.length < 1) {
      return <></>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
              <td>
                <FontAwesomeIcon
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
        <button onClick={onCreateClicked}>Create</button>
        <div className="title">ALL CATEGORIES</div>
        {categoryTable()}
      </main>
      <Footer />
    </div>
  );
}
