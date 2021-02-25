import * as React from "react";
import { useKeyDown } from "../hooks/useKeyDown";
import "./Dialog.scss";

type Props = {
  onEscape?: () => void;
  children: JSX.Element;
};

export function Dialog(props: Props): JSX.Element {
  function handleEscape(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      props.onEscape?.();
    }
  }

  useKeyDown(handleEscape);

  return (
    <div className="nyx dialog">
      <div className="backdrop" />
      <div className="window">{props.children}</div>
    </div>
  );
}
