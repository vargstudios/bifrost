import * as React from "react";
import { Element } from "../api/elements";
import { faCogs } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ElementPreview } from "./ElementPreview";
import { Link } from "react-router-dom";

type Props = {
  element: Element;
};

export function ElementTile(props: Props): JSX.Element {
  const element = props.element;

  function processing() {
    return (
      <div className="preview">
        <div className="center" title="Processing...">
          <FontAwesomeIcon icon={faCogs} size="2x" />
        </div>
      </div>
    );
  }

  return (
    <Link to={"/elements/" + element.id} className="element">
      <div className="title">{element.name}</div>
      {element.previews ? <ElementPreview element={element} /> : processing()}
      <div className="details">
        {element.framecount} Frames, {element.framerate} FPS
        {element.alpha ? ", Alpha" : ""}
      </div>
    </Link>
  );
}
