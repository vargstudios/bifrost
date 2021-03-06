import * as React from "react";
import { useState } from "react";
import { Dialog } from "../nyx/Dialog";
import { TextBox } from "../nyx/TextBox";
import { Button } from "../nyx/Button";
import { ElementCategory, updateCategory } from "../api/element-categories";
import { Error } from "../api/error";
import { Column } from "../nyx/Column";
import { Row } from "../nyx/Row";

type Props = {
  category: ElementCategory;
  onSaved: () => void;
  onCancel: () => void;
};

export function EditCategoryDialog(props: Props): JSX.Element {
  const [name, setName] = useState(props.category.name);

  function save() {
    updateCategory(props.category.id, {
      name: name,
    })
      .then(props.onSaved)
      .catch((error: Error) => alert("Save error: " + error.details));
  }

  return (
    <Dialog onDismiss={props.onCancel}>
      <div className="mainlayout">
        <Column>
          <h2>EDIT CATEGORY</h2>
          <TextBox id="name" label="Name" value={name} onChange={setName} />
          <Row>
            <Button label="Save" onClick={save} />
            <Button label="Cancel" onClick={props.onCancel} />
          </Row>
        </Column>
      </div>
    </Dialog>
  );
}
