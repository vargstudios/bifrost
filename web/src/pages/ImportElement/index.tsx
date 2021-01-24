import * as React from "react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Category, listCategories } from "../../api/categories";
import { Header } from "../../components/Header";
import { ImportSidebar } from "../../components/ImportSidebar";
import { Footer } from "../../components/Footer";
import { toList } from "../../utils/FileUtils";
import { analyseExr } from "../../api/analysis";
import { Element, createElement, importFrame } from "../../api/elements";
import { Textbox } from "../../components/Textbox";
import { Selectbox } from "../../components/Selectbox";
import { Progressbar } from "../../components/Progressbar";
import { DefineElement, Importing, State } from "./state";

export function ImportElementPage(props: RouteComponentProps): JSX.Element {
  const fileRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>({ type: "SelectFiles" });
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    listCategories().then(setCategories);
  }, []);

  function onFileInputChanged(e: ChangeEvent<HTMLInputElement>): void {
    const files = toList(e.target.files);
    if (files.length < 1) {
      return;
    }
    setState({
      type: "Analysing",
      files: files,
    });
    analyseExr(files[0])
      .then((analysis) => {
        setState({
          type: "DefineElement",
          files: files,
          analysis: analysis,
          name: files[0].name, // TODO
          categoryId: categories[0].id, // TODO
        });
      })
      .catch((error) => {
        setState({
          type: "AnalysisError",
          files: files,
          error: error,
        });
      });
  }

  function onImportClicked() {
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
      .then((element) =>
        setState({
          type: "Success",
          name: state.name,
          elementId: element.id,
        })
      )
      .catch((error) =>
        setState({
          ...state,
          type: "ImportError",
          error: error,
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
      case "SelectFiles":
        return (
          <>
            <div>Select a sequence of OpenEXR frames in linear RGB or RGBA</div>
            <button onClick={() => fileRef.current!.click()}>
              Select files
            </button>
            <input
              type="file"
              accept=".exr"
              multiple
              ref={fileRef}
              onChange={onFileInputChanged}
              style={{ display: "none" }}
            />
          </>
        );
      case "Analysing":
        return (
          <>
            <div>Analysing...</div>
          </>
        );
      case "AnalysisError":
        return (
          <>
            <div>Analysis failed: {state.error}</div>
          </>
        );
      case "DefineElement":
        return (
          <>
            <Textbox
              id="name"
              label="Name"
              value={state.name}
              onChange={(value) => setState({ ...state, name: value })}
            />
            <Selectbox
              id="category"
              label="Category"
              options={categories.map((category) => ({
                value: category.id,
                name: category.name,
              }))}
              value={state.categoryId}
              onChange={(value) => setState({ ...state, categoryId: value })}
            />
            <div>
              {state.files.length} Frames, {state.analysis.framerate} FPS,{" "}
              {state.analysis.alpha ? "RGBA" : "RGB"}
            </div>
            <div>
              <button onClick={onImportClicked}>Import element</button>
              <button onClick={() => setState({ type: "SelectFiles" })}>
                Cancel
              </button>
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
            <Progressbar
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
              <button onClick={() => setState({ type: "SelectFiles" })}>
                Import another
              </button>
            </div>
          </>
        );
    }
  }

  return (
    <div className="layout">
      <Header />
      <ImportSidebar />
      <main className="import">
        <div className="title">IMPORT ELEMENT</div>
        {renderDynamic()}
      </main>
      <Footer />
    </div>
  );
}
