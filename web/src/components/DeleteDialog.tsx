import * as React from "react";
import { useEffect } from "react";
import { Dialog } from "./Dialog";
import { Button } from "./Button";

type Props = {
  title: string;
  name: string;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteDialog(props: Props): JSX.Element {
  const id = "focus-me";

  useEffect(() => {
    document.getElementById(id)?.focus();
  }, []);

  function cancelIfEscape(event: React.KeyboardEvent): void {
    if (event.key === "Escape") {
      props.onCancel();
    }
  }

  return (
    <Dialog>
      <div className="import" onKeyDown={cancelIfEscape}>
        <div className="title">{props.title}</div>
        <div>Are you sure you want to delete "{props.name}"?</div>
        <div>
          <Button label="Delete" onClick={() => props.onDelete()} id={id} />
          <Button label="Cancel" onClick={() => props.onCancel()} />
        </div>
      </div>
    </Dialog>
  );
}
