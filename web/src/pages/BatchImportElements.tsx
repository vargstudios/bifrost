import * as React from "react";
import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { ConfigSidebar } from "../components/ConfigSidebar";
import { ElementCategory, listCategories } from "../api/element-categories";
import { Button } from "../nyx/Button";
import { Error } from "../api/error";
import { Layout } from "../components/Layout";
import { Column } from "../nyx/Column";
import { importElements, scanElements, ScannedElement } from "../api/batch";
import { TextBox } from "../nyx/TextBox";
import { SelectBox } from "../nyx/SelectBox";
import { IconButton } from "../components/IconButton";
import { faCheckSquare, faSquare } from "@fortawesome/free-regular-svg-icons";

type ElementRow = {
  selected: boolean;
  name: string;
  categoryId: string;
  scanned: ScannedElement;
};

export function BatchImportElementsPage(): JSX.Element {
  const [categories, setCategories] = useState<ElementCategory[]>([]);
  const [elements, setElements] = useState<ElementRow[]>([]);

  useEffect(loadCategories, []);

  function loadCategories(): void {
    listCategories()
      .then((categories: ElementCategory[]) => {
        setCategories(categories.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch((error: Error) => alert("Load error: " + error.details));
  }

  function scanFolder(): void {
    scanElements()
      .then((elements: ScannedElement[]) => {
        setElements(
          elements
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((element) => ({
              selected: false,
              name: element.name,
              categoryId: categories[0].id, // TODO: Handle no categories
              scanned: element,
            }))
        );
      })
      .catch((error: Error) => alert("Load error: " + error.details));
  }

  function importSelected(): void {
    importElements(
      elements
        .filter((element) => element.selected)
        .map((element) => ({
          scanId: element.scanned.scanId,
          categoryId: element.categoryId,
          name: element.name,
        }))
    )
      .then(() => setElements([]))
      .catch((error: Error) => alert("Load error: " + error.details));
  }

  function updateElement(index: number, element: ElementRow): void {
    setElements(elements.map((el, idx) => (idx === index ? element : el)));
  }

  function elementTable(): JSX.Element {
    if (elements.length < 1) {
      return <p>No elements</p>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th title="Selected">Sel</th>
            <th>Name</th>
            <th>Category</th>
            <th>Length</th>
            <th>Width</th>
            <th>Height</th>
            <th>Framerate</th>
            <th>Channels</th>
          </tr>
        </thead>
        <tbody>
          {elements.map((element, index) => (
            <tr key={element.scanned.scanId}>
              <td>
                {element.selected ? (
                  <IconButton
                    size="small"
                    title="Deselect"
                    icon={faCheckSquare}
                    onClick={() =>
                      updateElement(index, { ...element, selected: false })
                    }
                  />
                ) : (
                  <IconButton
                    size="small"
                    title="Select"
                    icon={faSquare}
                    onClick={() =>
                      updateElement(index, { ...element, selected: true })
                    }
                  />
                )}
              </td>
              <td>
                <TextBox
                  value={element.name}
                  onChange={(value) =>
                    updateElement(index, { ...element, name: value })
                  }
                />
              </td>
              <td>
                <SelectBox
                  options={categories.map((category) => ({
                    value: category.id,
                    name: category.name,
                  }))}
                  value={element.categoryId}
                  onChange={(value) =>
                    updateElement(index, { ...element, categoryId: value })
                  }
                />
              </td>
              <td>{element.scanned.framecount} Frames</td>
              <td>{element.scanned.width}</td>
              <td>{element.scanned.height}</td>
              <td>{element.scanned.framerate} FPS</td>
              <td>{element.scanned.channels}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <Layout>
      <Header />
      <ConfigSidebar />
      <main className="mainlayout">
        <Column>
          <h2>BATCH IMPORT ELEMENTS</h2>
          <p>Detect OpenEXR sequences in Bifrost's scan folder</p>
          <Button label="Scan folder" onClick={scanFolder} />
          {elementTable()}
          <Button label="Import selected" onClick={importSelected} />
        </Column>
      </main>
      <Footer />
    </Layout>
  );
}
