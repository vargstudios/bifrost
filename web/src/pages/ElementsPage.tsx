import * as React from "react";
import { useEffect, useState } from "react";
import { ElementCategory, listCategories } from "../api/element-categories";
import { Element, listElements } from "../api/elements";
import { ElementTile } from "../components/ElementTile";
import { Header } from "../components/Header";
import { ElementsSidebar } from "../components/ElementsSidebar";
import { Footer } from "../components/Footer";
import { useQuery } from "../hooks/useQuery";
import { TextBox } from "../nyx/TextBox";
import { normalize } from "../utils/StringUtils";
import { Layout } from "../components/Layout";
import { Error } from "../api/error";

export function ElementsPage(): JSX.Element {
  const [categories, setCategories] = useState<ElementCategory[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [search, setSearch] = useState<string>("");
  const query = useQuery();
  const currentCategory = query.get("category");

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .catch((error: Error) =>
        alert("Failed to list categories: " + error.details)
      );
    listElements()
      .then(setElements)
      .catch((error: Error) =>
        alert("Failed to list elements: " + error.details)
      );
  }, []);

  return (
    <Layout>
      <Header />
      <ElementsSidebar categories={categories} />
      <main className="elements-page">
        <TextBox
          id="search"
          placeholder="Search"
          value={search}
          onChange={setSearch}
        />
        <div className="elements">
          {elements
            .filter(
              (element) =>
                currentCategory === element.category.id ||
                currentCategory === null
            )
            .filter((element) =>
              normalize(element.name).includes(normalize(search))
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((element) => (
              <ElementTile element={element} key={element.id} />
            ))}
        </div>
      </main>
      <Footer />
    </Layout>
  );
}
