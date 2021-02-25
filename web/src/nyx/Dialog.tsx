import * as React from "react";
import "./Dialog.scss";

type Props = {
  onEscape?: () => void;
  children: JSX.Element;
};

export function Dialog(props: Props): JSX.Element {
  function handleEscape(event: React.KeyboardEvent): void {
    if (event.key === "Escape") {
      props.onEscape?.();
    }
  }
  return (
    <div className="nyx dialog" onKeyDown={handleEscape}>
      <div className="backdrop" />
      <div className="window">{props.children}</div>
    </div>
  );
}
