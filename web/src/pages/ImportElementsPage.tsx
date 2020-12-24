import * as React from "react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { RouteComponentProps } from "react-router";
import { Category, listCategories } from "../api/categories";
import { Header } from "../components/Header";
import { ImportSidebar } from "../components/ImportSidebar";
import { Footer } from "../components/Footer";
import { toList } from "../utils/FileUtils";
import { analyseExr, ExrAnalysis } from "../api/analysis";
import { createElement, importFrame } from "../api/elements";
import { Textbox } from "../components/Textbox";
import { Selectbox } from "../components/Selectbox";
import { Progressbar } from "../components/Progressbar";

enum State {
  SelectFiles,
  Analysis,
  AnalysisError,
  ConfirmDetails,
  Import,
  ImportError,
  Success,
}

export function ImportElementsPage(props: RouteComponentProps): JSX.Element {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [state, setState] = useState<State>(State.SelectFiles);
  const [files, setFiles] = useState<File[]>([]);

  const [name, setName] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const [totalFrames, setTotalFrames] = useState<number>(0);
  const [importedFrames, setImportedFrames] = useState<number>(0);

  const [startTime, setStartTime] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const [analysis, setAnalysis] = useState<ExrAnalysis | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    listCategories()
      .then(setCategories)
      .then(() => setCategory(categories[0].id));
  }, []);

  function onSelectFilesClicked() {
    fileInputRef.current!.click();
  }

  function onFileInputChanged(e: ChangeEvent<HTMLInputElement>): void {
    const files = toList(e.target.files);
    if (files.length < 1) {
      return;
    }

    setState(State.Analysis);
    analyseExr(files[0])
      .then((analysis) => {
        setFiles(files);
        setName(files[0].name); // TODO
        setTotalFrames(files.length);
        setImportedFrames(0);
        setAnalysis(analysis);
        setState(State.ConfirmDetails);
      })
      .catch(() => {
        setState(State.AnalysisError);
      });
  }

  async function onImportClicked(): Promise<void> {
    setStartTime(Date.now() / 1000);
    setCurrentTime(Date.now() / 1000);
    setState(State.Import);

    const element = await createElement({
      categoryId: category,
      name: name,
      framecount: totalFrames,
      framerate: analysis!.framerate,
      width: analysis!.width,
      height: analysis!.height,
      alpha: analysis!.alpha,
    });

    for (let i = 0; i < totalFrames; i++) {
      setImportedFrames(i);
      await importFrame(element.id, i + 1, files[i]);
      setCurrentTime(Date.now() / 1000);
    }
    setImportedFrames(totalFrames);
    setState(State.Success);
  }

  function onCancelClicked(): void {
    setState(State.SelectFiles);
  }

  function renderSelectFiles(): JSX.Element {
    return (
      <section>
        <div className="title">IMPORT ELEMENT</div>
        <div>Select a sequence of OpenEXR frames in linear RGB or RGBA</div>
        <button onClick={onSelectFilesClicked}>Select files</button>
        <input
          type="file"
          accept=".exr"
          multiple
          ref={fileInputRef}
          onChange={onFileInputChanged}
          style={{ display: "none" }}
        />
      </section>
    );
  }

  function renderConfirmDetails(): JSX.Element {
    return (
      <section>
        <div className="title">IMPORT ELEMENT</div>
        <Textbox id="name" label="Name" value={name} onChange={setName} />
        <Selectbox
          id="category"
          label="Category"
          options={categories.map((category) => ({
            value: category.id,
            name: category.name,
          }))}
          value={category}
          onChange={setCategory}
        />
        <div>
          {totalFrames} Frames, {analysis?.framerate} FPS,{" "}
          {analysis?.alpha ? "RGBA" : "RGB"}
        </div>
        <div>
          <button onClick={onImportClicked}>Import element</button>
          <button onClick={onCancelClicked}>Cancel</button>
        </div>
      </section>
    );
  }

  function renderImport(): JSX.Element {
    const elapsedTime = currentTime - startTime;
    const estimateTime = (elapsedTime / importedFrames) * totalFrames;
    const remainingTime = Math.ceil(estimateTime - elapsedTime);
    return (
      <section>
        <div className="title">IMPORT ELEMENT</div>
        <div>
          Importing frame {importedFrames + 1} / {totalFrames}
        </div>
        <Progressbar current={importedFrames} total={totalFrames} />
        <div>{remainingTime} seconds remaining</div>
      </section>
    );
  }

  function renderSuccess(): JSX.Element {
    return (
      <section>
        <div className="title">IMPORT ELEMENT</div>
        Success!
      </section>
    );
  }

  function render(): JSX.Element {
    switch (state) {
      case State.SelectFiles:
      case State.Analysis:
      case State.AnalysisError:
        return renderSelectFiles();
      case State.ConfirmDetails:
        return renderConfirmDetails();
      case State.Import:
      case State.ImportError:
        return renderImport();
      case State.Success:
        return renderSuccess();
    }
  }
  return (
    <div className="layout">
      <Header />
      <ImportSidebar />
      <main className="import">{render()}</main>
      <Footer />
    </div>
  );
}
