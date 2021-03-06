import * as React from "react";
import { Dialog } from "../nyx/Dialog";
import { Button } from "../nyx/Button";

type Props = {
  title: string;
  name: string;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteDialog(props: Props): JSX.Element {
  return (
    <Dialog onDismiss={() => props.onCancel()}>
      <div className="import">
        <div className="title">{props.title}</div>
        <div>Are you sure you want to delete "{props.name}"?</div>
        <div>
          <Button label="Delete" onClick={() => props.onDelete()} />
          <Button label="Cancel" onClick={() => props.onCancel()} />
        </div>
      </div>
    </Dialog>
  );
}
