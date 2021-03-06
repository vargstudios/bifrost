import * as React from "react";
import { Dialog } from "../nyx/Dialog";
import { Button } from "../nyx/Button";
import { Column } from "../nyx/Column";
import { Row } from "../nyx/Row";

type Props = {
  title: string;
  name: string;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteDialog(props: Props): JSX.Element {
  return (
    <Dialog onDismiss={() => props.onCancel()}>
      <div className="mainlayout">
        <Column>
          <h2>{props.title}</h2>
          <div>Are you sure you want to delete "{props.name}"?</div>
          <Row>
            <Button label="Delete" onClick={() => props.onDelete()} />
            <Button label="Cancel" onClick={() => props.onCancel()} />
          </Row>
        </Column>
      </div>
    </Dialog>
  );
}
