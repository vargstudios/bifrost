import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ElementCategory, listCategories } from "../../api/element-categories";
import { Header } from "../../components/Header";
import { ConfigSidebar } from "../../components/ConfigSidebar";
import { Footer } from "../../components/Footer";
import { toList } from "../../utils/FileUtils";
import { analyseExr, ExrAnalysis } from "../../api/analysis";
import { createElement, Element, importFrame } from "../../api/elements";
import { TextBox } from "../../nyx/TextBox";
import { SelectBox } from "../../nyx/SelectBox";
import { ProgressBar } from "../../nyx/ProgressBar";
import { Importing, State } from "./state";
import { Filename, parseFilename } from "../../utils/FilenameUtils";
import { isConsecutive, unique } from "../../utils/ArrayUtils";
import { Button } from "../../nyx/Button";
import { Error } from "../../api/error";
import { Layout } from "../../components/Layout";

export function ImportElementPage(): JSX.Element {
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>({ type: "Loading" });

  useEffect(load, []);

  function load() {
    listCategories()
      .then((categories: ElementCategory[]) => {
        if (categories.length < 1) {
          setState({ type: "LoadingError", error: "No categories exist" });
        } else {
          setState({ type: "SelectFiles", categories: categories });
        }
      })
      .catch((error: Error) =>
        setState({ type: "LoadingError", error: error.details })
      );
  }

  function onFilesChanged(categories: ElementCategory[], files: File[]): void {
    if (files.length < 1) {
      return;
    }

    // Check pattern
    const maybeFilenames = files.map((file) => file.name).map(parseFilename);
    if (maybeFilenames.some((filename) => filename == null)) {
      return setState({
        type: "AnalysisError",
        categories: categories,
        error: "Unsupported filename pattern. Try <name>.<sequence_number>.exr",
      });
    }
    const filenames = maybeFilenames as Filename[];

    // Check names
    const uniqueNames = filenames
      .map((filename) => filename.name)
      .filter(unique);
    if (uniqueNames.length != 1) {
      return setState({
        type: "AnalysisError",
        categories: categories,
        error: "Multiple names: " + JSON.stringify(uniqueNames),
      });
    }

    // Check sequence
    const sequence = filenames.map((filename) => filename.sequence);
    if (!sequence.every(isConsecutive)) {
      return setState({
        type: "AnalysisError",
        categories: categories,
        error: "Non-consecutive sequence: " + JSON.stringify(sequence),
      });
    }

    setState({
      type: "Analysing",
      categories: categories,
      files: files,
    });
    analyseExr(files[0])
      .then((analysis: ExrAnalysis) => {
        setState({
          type: "DefineElement",
          categories: categories,
          files: files,
          analysis: analysis,
          name: uniqueNames[0],
          categoryId: categories[0].id, // TODO: Find most likely
        });
      })
      .catch((error: Error) =>
        setState({
          type: "AnalysisError",
          categories: categories,
          error: error.details,
        })
      );
  }

  function onImportClicked(): void {
    if (state.type !== "DefineElement") {
      return;
    }
    if (!state.name || !state.categoryId) {
      return;
    }

    const stateImporting: Importing = {
      ...state,
      type: "Importing",
      currentFrame: 0,
      totalFrames: state.files.length,
      startTime: Date.now() / 1000,
      currentTime: Date.now() / 1000,
    };
    setState(stateImporting);

    importElement(stateImporting)
      .then((element: Element) =>
        setState({
          type: "Success",
          categories: state.categories,
          name: state.name,
          elementId: element.id,
        })
      )
      .catch((error: Error) =>
        setState({
          ...state,
          type: "ImportError",
          error: error.details,
        })
      );
  }

  async function importElement(state: Importing): Promise<Element> {
    const element = await createElement({
      categoryId: state.categoryId,
      name: state.name,
      framecount: state.files.length,
      framerate: state.analysis.framerate,
      width: state.analysis.width,
      height: state.analysis.height,
      channels: state.analysis.channels,
      alpha: state.analysis.alpha,
    });
    for (let i = 0; i < state.totalFrames; i++) {
      await importFrame(element.id, i + 1, state.files[i]);
      setState({
        ...state,
        currentFrame: i + 1,
        currentTime: Date.now() / 1000,
      });
    }
    return element;
  }

  function renderDynamic(): JSX.Element {
    switch (state.type) {
      case "Loading":
        return <></>;
      case "LoadingError":
        return <div>Loading error: {state.error}</div>;
      case "SelectFiles":
      case "Analysing":
      case "AnalysisError":
        return (
          <>
            <div>Select a sequence of OpenEXR frames in linear RGB or RGBA</div>
            <Button
              label="Select files"
              onClick={() => fileRef.current!.click()}
            />
            <input
              type="file"
              accept=".exr"
              multiple
              ref={fileRef}
              onChange={(e) =>
                onFilesChanged(state.categories, toList(e.target.files))
              }
              style={{ display: "none" }}
            />
            {state.type === "Analysing" && <div>Analysing...</div>}
            {state.type === "AnalysisError" && (
              <div>Analysis error: {state.error}</div>
            )}
          </>
        );
      case "DefineElement":
        return (
          <>
            <TextBox
              id="name"
              label="Name"
              value={state.name}
              onChange={(value) => setState({ ...state, name: value })}
            />
            <SelectBox
              id="category"
              label="Category"
              options={state.categories
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => ({
                  value: category.id,
                  name: category.name,
                }))}
              value={state.categoryId}
              onChange={(value) => setState({ ...state, categoryId: value })}
            />
            <div>
              {state.files.length} Frames, {state.analysis.framerate} FPS,{" "}
              {state.analysis.channels}, {state.analysis.width}x
              {state.analysis.height} Pixels
            </div>
            <div>
              <Button label="Import element" onClick={onImportClicked} />
              <Button
                label="Cancel"
                onClick={() =>
                  setState({
                    type: "SelectFiles",
                    categories: state.categories,
                  })
                }
              />
            </div>
          </>
        );
      case "Importing":
        const elapsed = state.currentTime - state.startTime;
        const estimate = (elapsed / state.currentFrame) * state.totalFrames;
        const remaining = Math.ceil(estimate - elapsed);
        return (
          <>
            <div>
              Importing frame {state.currentFrame + 1} / {state.totalFrames}
            </div>
            <ProgressBar
              current={state.currentFrame}
              total={state.totalFrames}
            />
            <div>{remaining} seconds remaining</div>
          </>
        );
      case "ImportError":
        return (
          <>
            <div>Import failed: {state.error}</div>
          </>
        );
      case "Success":
        return (
          <>
            <div>Success! {state.name} has been imported.</div>
            <div>
              Previews and other versions will be available in a few minutes.
            </div>
            <div>
              <Button
                label="Import another"
                onClick={() =>
                  setState({
                    type: "SelectFiles",
                    categories: state.categories,
                  })
                }
              />
            </div>
          </>
        );
    }
  }

  return (
    <Layout>
      <Header />
      <ConfigSidebar />
      <main className="import">
        <div className="title">IMPORT ELEMENT</div>
        {renderDynamic()}
      </main>
      <Footer />
    </Layout>
  );
}
