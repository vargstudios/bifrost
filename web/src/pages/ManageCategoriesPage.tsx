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

  return (
    <div className="layout">
      <Header />
      <ConfigSidebar />
      <main className="import">
        <div className="title">MANAGE CATEGORIES</div>
        {categories.map((category) => (
          <div>
            {category.id} – {category.name}
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}
