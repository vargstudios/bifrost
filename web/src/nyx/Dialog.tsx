import * as React from "react";
import { useRef } from "react";
import { useKeyDown } from "../hooks/useKeyDown";
import { getFocusableChildren } from "../utils/FocusUtils";
import "./Dialog.scss";

type Props = {
  onEscape?: () => void;
  children: JSX.Element;
};

export function Dialog(props: Props): JSX.Element {
  const dialog = useRef<HTMLDivElement | null>(null);

  function handleEscape(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      props.onEscape?.();
    }
  }

  function handleFocus(event: KeyboardEvent): void {
    if (event.key !== "Tab") {
      return;
    }
    const focusable = getFocusableChildren(dialog.current!);
    if (focusable.length < 1) {
      return;
    }
    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    // Lock focus inside dialog
    if (event.shiftKey && document.activeElement == firstFocusable) {
      lastFocusable.focus();
      event.preventDefault();
    }
    if (!event.shiftKey && document.activeElement == lastFocusable) {
      firstFocusable.focus();
      event.preventDefault();
    }
  }

  useKeyDown(handleEscape);
  useKeyDown(handleFocus);

  return (
    <div className="nyx dialog" ref={dialog}>
      <div className="backdrop" />
      <div className="window">{props.children}</div>
    </div>
  );
}
