import * as React from "react";
import { EditableElement } from "./state";
import { ElementCategory } from "../../api/element-categories";
import { CheckBox } from "../../nyx/CheckBox";
import { TextBox } from "../../nyx/TextBox";
import { SelectBox } from "../../nyx/SelectBox";

type Props = {
  categories: ElementCategory[];
  elements: EditableElement[];
  onChange: (index: number, element: EditableElement) => void;
};

export function EditableElementTable(props: Props): JSX.Element {
  return (
    <table>
      <thead>
        <tr>
          <th title="Selected">Sel</th>
          <th>Name</th>
          <th>Category</th>
          <th>Length</th>
          <th>Width</th>
          <th>Height</th>
          <th>Framerate</th>
          <th>Channels</th>
        </tr>
      </thead>
      <tbody>
        {props.elements.map((element, index) => (
          <tr key={element.scanned.scanId}>
            <td>
              <CheckBox
                value={element.selected}
                onChange={(selected) =>
                  props.onChange(index, { ...element, selected: selected })
                }
              />
            </td>
            <td>
              <TextBox
                value={element.name}
                onChange={(value) =>
                  props.onChange(index, { ...element, name: value })
                }
              />
            </td>
            <td>
              <SelectBox
                options={props.categories.map((category) => ({
                  value: category.id,
                  name: category.name,
                }))}
                value={element.categoryId}
                onChange={(value) =>
                  props.onChange(index, { ...element, categoryId: value })
                }
              />
            </td>
            <td>{element.scanned.framecount} Frames</td>
            <td>{element.scanned.width}</td>
            <td>{element.scanned.height}</td>
            <td>{element.scanned.framerate} FPS</td>
            <td>{element.scanned.channels}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
