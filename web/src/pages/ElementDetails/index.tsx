import * as React from "react";
import { useEffect, useState } from "react";
import {
  deleteElement,
  Element,
  ElementVersion,
  getElement,
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
import { DeleteDialog } from "../../components/DeleteDialog";
import { Layout } from "../../components/Layout";
import { EditElementDialog } from "../../components/EditElementDialog";
import { Column } from "../../nyx/Column";

export function ElementDetailsPage(): JSX.Element {
  const [state, setState] = useState<State>({ type: "Loading" });
  const { id } = useParams<{ id: string }>();

  useEffect(loadElement, [id]);

  function loadElement() {
    setState({ type: "Loading" });
    getElement(id)
      .then((element: Element) =>
        setState({ type: "Details", element: element })
      )
      .catch((error: Error) =>
        setState({ type: "Failed", error: error.details })
      );
  }

  function onDeleteClicked(id: string): void {
    deleteElement(id)
      .then(loadElement)
      .catch((error: Error) => alert("Delete error: " + error.details));
  }

  function renderElement(element: Element): JSX.Element {
    return (
      <>
        <h2>
          {element.name}
          <span style={{ marginLeft: "var(--size-2)" }}>
            <IconButton
              size="small"
              title="Rename"
              icon={faPencilAlt}
              onClick={() => setState({ type: "Edit", element: element })}
            />
          </span>
          <span style={{ marginLeft: "var(--size-1)" }}>
            <IconButton
              size="small"
              title="Delete"
              icon={faTrash}
              onClick={() => setState({ type: "Delete", element: element })}
            />
          </span>
        </h2>
        <ElementPreview element={element} />
        <p>
          {element.framecount} Frames, {element.framerate} FPS,{" "}
          {element.channels}
        </p>
        {renderVersionTable(
          element.versions.filter((version) => version.name !== "Preview")
        )}
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

  function renderDynamic(): JSX.Element {
    switch (state.type) {
      case "Loading":
        return <p>Loading...</p>;
      case "Details":
      case "Edit":
      case "Delete":
        return renderElement(state.element);
      case "Failed":
        return <p>Error: {state.error}</p>;
    }
  }

  function editDialog(): JSX.Element | null {
    if (state.type !== "Edit") {
      return null;
    }
    return (
      <EditElementDialog
        element={state.element}
        onSaved={() => loadElement()}
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
    <Layout>
      <Header />
      <aside className="sidebar">
        <div className="heading">ELEMENT</div>
        <NavLink to={`/elements/${id}`}>Details</NavLink>
      </aside>
      <main className="mainlayout element-details">
        <Column>{renderDynamic()}</Column>
      </main>
      <Footer />
      {editDialog()}
      {deleteDialog()}
    </Layout>
  );
}
