import * as React from "react";
import { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Category, listCategories } from "../api/categories";
import { Element, listElements } from "../api/elements";
import { ElementPreview } from "../components/ElementPreview";
import { Header } from "../components/Header";
import { ElementsSidebar } from "../components/ElementsSidebar";
import { Footer } from "../components/Footer";

export function BrowseElementsPage(props: RouteComponentProps): JSX.Element {
  const [categories, setCategories] = useState<Category[]>([]);
  const [elements, setElements] = useState<Element[]>([]);

  useEffect(() => {
    listCategories().then(setCategories);
    listElements().then(setElements);
  }, []);

  return (
    <div className="layout">
      <Header />
      <ElementsSidebar categories={categories} />
      <main>
        <div className="elements">
          {elements.map((element) => (
            <ElementPreview element={element} key={element.id} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
