import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConfigSidebar } from "../components/ConfigSidebar";
import { Category, listCategories } from "../api/categories";

export function ManageCategoriesPage(props: RouteComponentProps): JSX.Element {
  const [categories, setCategory] = useState<Category[]>([]);

  useEffect(() => {
    listCategories().then(setCategory);
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id}>
              <td>{category.id}</td>
              <td>{category.name}</td>
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
        <div className="title">MANAGE CATEGORIES</div>
        {categoryTable()}
      </main>
      <Footer />
    </div>
  );
}
