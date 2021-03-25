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
import {
  BatchImportElementItem,
  BatchImportElementsState,
  BatchScannedElement,
  importElements,
  scanElements,
  stateElements,
} from "../api/batch";
import { TextBox } from "../nyx/TextBox";
import { SelectBox } from "../nyx/SelectBox";
import { CheckBox } from "../nyx/CheckBox";
import { useInterval } from "../hooks/useInterval";
import { ProgressBar } from "../nyx/ProgressBar";

type ElementRow = {
  selected: boolean;
  name: string;
  categoryId: string;
  scanned: BatchScannedElement;
};

export function BatchImportElementsPage(): JSX.Element {
  const [state, setState] = useState<BatchImportElementsState>({
    type: "Scanning",
  });
  const [categories, setCategories] = useState<ElementCategory[]>([]);
  const [elements, setElements] = useState<ElementRow[]>([]);
  const [now, setNow] = useState<number>(Date.now() / 1000);

  useEffect(loadCategories, []);
  useInterval(() => {
    if (state.type === "Scanning" || state.type === "Importing") {
      loadState();
    }
  }, 200);
  useInterval(() => setNow(Date.now() / 1000), 1000);

  function loadState(): void {
    stateElements()
      .then((state: BatchImportElementsState) => {
        setState(state);
        if (state.type === "Scanned") {
          setElements(
            state.scanned
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((element) => ({
                selected: false,
                name: element.name,
                categoryId: categories[0].id, // TODO: Handle no categories
                scanned: element,
              }))
          );
        } else {
          setElements([]);
        }
      })
      .catch((error: Error) => {
        console.log(error);
        alert("Load error 1: " + error.details);
      });
  }

  function loadCategories(): void {
    listCategories()
      .then((categories: ElementCategory[]) => {
        setCategories(categories.sort((a, b) => a.name.localeCompare(b.name)));
      })
      .catch((error: Error) => alert("Load error 2: " + error.details));
  }

  function scanNow(): void {
    scanElements()
      .then(() => loadState())
      .catch((error: Error) => alert("Scan error: " + error.details));
  }

  function importSelected(): void {
    if (elements.filter((element) => element.selected).length < 1) {
      return;
    }
    importElements(
      elements
        .filter((element) => element.selected)
        .map((element) => ({
          scanId: element.scanned.scanId,
          categoryId: element.categoryId,
          name: element.name,
        }))
    )
      .then(() => loadState())
      .catch((error: Error) => alert("Import error: " + error.details));
  }

  function updateElement(index: number, element: ElementRow): void {
    setElements(elements.map((el, idx) => (idx === index ? element : el)));
  }

  function elementTable(elements: ElementRow[]): JSX.Element {
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
                <CheckBox
                  value={element.selected}
                  onChange={(selected) =>
                    updateElement(index, { ...element, selected: selected })
                  }
                />
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

  function itemTable(items: BatchImportElementItem[]): JSX.Element {
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Length</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.element.name}</td>
              <td>
                {
                  categories.find(
                    (category) => category.id === item.element.categoryId
                  )?.name
                }
              </td>
              <td>{item.element.framecount} Frames</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function ago(time: number): string {
    const seconds = Math.floor(now - time);
    if (seconds < 60) {
      return `${seconds} seconds ago`;
    }
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes} minutes ago`;
    }
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours} hours ago`;
    }
    const days = Math.floor(hours / 24);
    return `${days} hours ago`;
  }

  function renderDynamic(): JSX.Element {
    switch (state.type) {
      case "Scanning":
        return (
          <>
            <p>Scanning...</p>
          </>
        );
      case "Scanned":
        return (
          <>
            <p>
              Found {state.scanned.length} OpenEXR sequences in Bifrost's scan
              folder ({ago(state.time)})
            </p>
            <Button label="Scan now" onClick={scanNow} />
            {state.scanned.length > 0 && (
              <>
                {elementTable(elements)}
                <Button label="Import selected" onClick={importSelected} />
              </>
            )}
          </>
        );
      case "Importing": {
        const done = state.items.filter((item) => item.status !== "PENDING");
        return (
          <>
            <p>Importing {state.items.length} elements...</p>
            <ProgressBar current={done.length} total={state.items.length} />
            {itemTable(state.items)}
          </>
        );
      }
      case "Imported":
        const success = state.items.filter((item) => item.status === "SUCCESS");
        return (
          <>
            <p>
              Import complete! {success.length}/{state.items.length} elements
              were successful.
            </p>
            <Button label="Scan now" onClick={scanNow} />
            {itemTable(state.items)}
            <p>
              Sit back and relax while Bifrost creates downscaled versions and
              previews.
            </p>
          </>
        );
    }
  }

  return (
    <Layout>
      <Header />
      <ConfigSidebar />
      <main className="mainlayout">
        <Column>
          <h2>BATCH IMPORT ELEMENTS</h2>
          {renderDynamic()}
        </Column>
      </main>
      <Footer />
    </Layout>
  );
}
