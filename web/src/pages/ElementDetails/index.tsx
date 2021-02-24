import * as React from "react";
import { useEffect, useState } from "react";
import {
  deleteElement,
  Element,
  ElementVersion,
  getElement,
  renameElement,
} from "../../api/elements";
import { Header } from "../../components/Header";
import { Footer } from "../../components/Footer";
import { NavLink, useParams } from "react-router-dom";
import { ElementPreview } from "../../components/ElementPreview";
import { IconButton } from "../../components/IconButton";
import {
  faCopy,
  faPencilAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { copyToClipboard } from "../../utils/ClipboardUtils";
import { State } from "./state";
import { Error } from "../../api/error";
import { RenameDialog } from "../../components/RenameDialog";
import { DeleteDialog } from "../../components/DeleteDialog";

export function ElementDetailsPage(): JSX.Element {
  const [state, setState] = useState<State>({ type: "Loading" });
  const { id } = useParams<{ id: string }>();

  useEffect(loadElement, []);

  function loadElement() {
    getElement(id)
      .then((element: Element) =>
        setState({ type: "Details", element: element })
      )
      .catch((error: Error) =>
        setState({ type: "Failed", error: error.details })
      );
  }

  function onRenameClicked(id: string, name: string): void {
    renameElement(id, name)
      .then(loadElement)
      .catch((error: Error) => alert("Rename error: " + error.details));
  }

  function onDeleteClicked(id: string): void {
    deleteElement(id)
      .then(loadElement)
      .catch((error: Error) => alert("Delete error: " + error.details));
  }

  function renderElement(element: Element): JSX.Element {
    return (
      <>
        <div className="title">{element.name}</div>
        <ElementPreview element={element} />
        <div className="details">
          {element.framecount} Frames, {element.framerate} FPS,{" "}
          {element.channels}
        </div>
        {renderVersionTable(
          element.versions.filter((version) => version.name !== "Preview")
        )}
        <div>
          <IconButton
            size="small"
            title="Rename"
            icon={faPencilAlt}
            onClick={() => setState({ type: "Rename", element: element })}
          />
          <IconButton
            size="small"
            title="Delete"
            icon={faTrash}
            onClick={() => setState({ type: "Delete", element: element })}
          />
        </div>
      </>
    );
  }

  function renderVersionTable(versions: ElementVersion[]): JSX.Element {
    if (versions.length < 1) {
      return <div>No versions</div>;
    }
    return (
      <table>
        <thead>
          <tr>
            <th>Version</th>
            <th>Width</th>
            <th>Height</th>
            <th>Location</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {versions.map((version) => (
            <tr key={version.id}>
              <td>{version.name}</td>
              <td>{version.width}</td>
              <td>{version.height}</td>
              <td>{version.url}</td>
              <td>
                <IconButton
                  size="small"
                  title="Copy"
                  icon={faCopy}
                  onClick={() => copyToClipboard(version.url)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  function renameDialog(): JSX.Element | null {
    if (state.type !== "Rename") {
      return null;
    }
    return (
      <RenameDialog
        title="RENAME ELEMENT"
        name={state.element.name}
        onRename={(name) => onRenameClicked(state.element.id, name)}
        onCancel={() => setState({ type: "Details", element: state.element })}
      />
    );
  }

  function deleteDialog(): JSX.Element | null {
    if (state.type !== "Delete") {
      return null;
    }
    return (
      <DeleteDialog
        title="DELETE ELEMENT"
        name={state.element.name}
        onDelete={() => onDeleteClicked(state.element.id)}
        onCancel={() => setState({ type: "Details", element: state.element })}
      />
    );
  }

  return (
    <div className="layout fullscreen">
      <Header />
      <aside className="sidebar">
        <div className="heading">ELEMENT</div>
        <NavLink to={`/elements/${id}`}>Details</NavLink>
      </aside>
      <main className="element-details">
        {state.type == "Details" ? renderElement(state.element) : "Not found"}
      </main>
      <Footer />
      {renameDialog()}
      {deleteDialog()}
    </div>
  );
}
