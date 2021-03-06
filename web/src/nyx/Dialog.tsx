import * as React from "react";
import { useEffect, useRef } from "react";
import { useKeyDown } from "../hooks/useKeyDown";
import { getFocusableChildren } from "../utils/FocusUtils";
import "./Dialog.scss";

type Props = {
  onDismiss?: () => void;
  children: JSX.Element;
};

export function Dialog(props: Props): JSX.Element {
  const dialog = useRef<HTMLDivElement | null>(null);

  function handleBackdropClick(): void {
    props.onDismiss?.();
  }

  function handleEscape(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      props.onDismiss?.();
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

  function focusFirst() {
    const focusable = getFocusableChildren(dialog.current!);
    focusable[0]?.focus();
  }

  useEffect(focusFirst, []);

  useKeyDown(handleEscape);
  useKeyDown(handleFocus);

  return (
    <div className="nyx dialog" ref={dialog}>
      <div className="backdrop" onMouseDown={handleBackdropClick} />
      <div className="window">{props.children}</div>
    </div>
  );
}
