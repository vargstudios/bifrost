import * as React from "react";
import { useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { ConfigSidebar } from "../../components/ConfigSidebar";
import { ElementCategory, listCategories } from "../../api/element-categories";
import { Button } from "../../nyx/Button";
import { Error } from "../../api/error";
import { Layout } from "../../components/Layout";
import { Column } from "../../nyx/Column";
import {
  BatchImportElementsState,
  importElements,
  scanElements,
  stateElements,
} from "../../api/batch";
import { ProgressBar } from "../../nyx/ProgressBar";
import { durationAsText } from "../../utils/TimeUtils";
import { EditableElement, Loaded, State } from "./state";
import { useInterval } from "../../hooks/useInterval";
import { EditableElementTable } from "./EditableElementTable";
import { BatchItemTable } from "./BatchItemTable";

export function BatchImportElementsPage(): JSX.Element {
  const [now, setNow] = useState<number>(Date.now() / 1000);
  const [state, setState] = useState<State>({
    type: "LoadingCategories",
  });

  useInterval(() => setNow(Date.now() / 1000), 1000);

  useEffect(() => {
    if (state.type === "LoadingCategories") {
      loadCategories();
    }
    if (state.type === "LoadingBatchState") {
      loadBatchState(state.categories);
    }
  }, [state]);

  useInterval(() => {
    if (state.type === "Loaded") {
      if (
        state.batchstate.type === "Scanning" ||
        state.batchstate.type === "Importing"
      ) {
        loadBatchState(state.categories);
      }
    }
  }, 500);

  function loadCategories(): void {
    listCategories()
      .then((categories: ElementCategory[]) => {
        if (categories.length < 1) {
          setState({
            type: "LoadingCategoriesError",
            error: "No categories found",
          });
        } else {
          setState({
            type: "LoadingBatchState",
            categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
          });
        }
      })
      .catch((error: Error) =>
        setState({ type: "LoadingCategoriesError", error: error.details })
      );
  }

  function loadBatchState(categories: ElementCategory[]): void {
    stateElements()
      .then((batchstate: BatchImportElementsState) => {
        setState({
          type: "Loaded",
          categories: categories,
          batchstate: batchstate,
          elements: createFormRows(categories, batchstate),
        });
      })
      .catch((error: Error) =>
        setState({
          type: "LoadingBatchStateError",
          categories: categories,
          error: error.details,
        })
      );
  }

  function createFormRows(
    categories: ElementCategory[],
    batchstate: BatchImportElementsState
  ): EditableElement[] {
    if (batchstate.type === "Scanned") {
      return batchstate.scanned
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((element) => ({
          selected: false,
          name: element.name,
          categoryId: categories[0].id, // TODO: Find most likely
          scanned: element,
        }));
    } else {
      return [];
    }
  }

  function scanNow(categories: ElementCategory[]): void {
    scanElements()
      .then(() =>
        setState({
          type: "LoadingBatchState",
          categories: categories,
        })
      )
      .catch((error: Error) => alert("Error starting scan: " + error.details));
  }

  function importSelected(
    categories: ElementCategory[],
    elements: EditableElement[]
  ): void {
    if (elements.filter((element) => element.selected).length < 1) {
      return;
    }
    const createElements = elements
      .filter((element) => element.selected)
      .map((element) => ({
        scanId: element.scanned.scanId,
        categoryId: element.categoryId,
        name: element.name,
      }));
    importElements(createElements)
      .then(() =>
        setState({
          type: "LoadingBatchState",
          categories: categories,
        })
      )
      .catch((error: Error) =>
        alert("Error starting import: " + error.details)
      );
  }

  function renderLoaded({
    categories,
    batchstate,
    elements,
  }: Loaded): JSX.Element {
    switch (batchstate.type) {
      case "Scanning":
        return <p>Scanning...</p>;
      case "Scanned":
        return (
          <>
            {batchstate.time > 0 ? (
              <p>
                Found {batchstate.scanned.length} OpenEXR sequences in Bifrost's
                scan folder ({durationAsText(now - batchstate.time)} ago)
              </p>
            ) : (
              <p>Scan for OpenEXR sequences in Bifrost's scan folder</p>
            )}
            <Button label="Scan now" onClick={() => scanNow(categories)} />
            {batchstate.scanned.length > 0 && (
              <>
                <EditableElementTable
                  categories={categories}
                  elements={elements}
                  onChange={(updatedIndex, updatedElement) =>
                    setState({
                      type: "Loaded",
                      categories: categories,
                      batchstate: batchstate,
                      elements: elements.map((element, index) =>
                        index === updatedIndex ? updatedElement : element
                      ),
                    })
                  }
                />
                <Button
                  label="Import selected"
                  onClick={() => importSelected(categories, elements)}
                />
              </>
            )}
          </>
        );
      case "Importing": {
        const done = batchstate.items.filter(
          (item) => item.status !== "PENDING"
        );
        return (
          <>
            <p>Importing {batchstate.items.length} elements...</p>
            <ProgressBar
              current={done.length}
              total={batchstate.items.length}
            />
            <BatchItemTable categories={categories} items={batchstate.items} />
          </>
        );
      }
      case "Imported":
        const success = batchstate.items.filter(
          (item) => item.status === "SUCCESS"
        );
        return (
          <>
            <p>
              Import complete! {success.length}/{batchstate.items.length}{" "}
              elements were successful ({durationAsText(now - batchstate.time)}{" "}
              ago)
            </p>
            <Button label="Scan now" onClick={() => scanNow(categories)} />
            <BatchItemTable categories={categories} items={batchstate.items} />
            <p>
              Sit back and relax while Bifrost creates downscaled versions and
              previews.
            </p>
          </>
        );
    }
  }

  function renderDynamic(): JSX.Element {
    switch (state.type) {
      case "LoadingCategories":
      case "LoadingBatchState":
        return <p>Loading...</p>;
      case "LoadingCategoriesError":
        return <p>Failed to load categories: {state.error}</p>;
      case "LoadingBatchStateError":
        return <p>Failed to load batch state: {state.error}</p>;
      case "Loaded":
        return renderLoaded(state);
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
