import { ElementCategory } from "../../api/element-categories";
import { BatchImportElementsState, BatchScannedElement } from "../../api/batch";

export type State =
  | LoadingCategories
  | LoadingCategoriesError
  | LoadingBatchState
  | LoadingBatchStateError
  | Loaded;

export type LoadingCategories = {
  type: "LoadingCategories";
};

export type LoadingCategoriesError = {
  type: "LoadingCategoriesError";
  error: string;
};

export type LoadingBatchState = {
  type: "LoadingBatchState";
  categories: ElementCategory[];
};

export type LoadingBatchStateError = {
  type: "LoadingBatchStateError";
  categories: ElementCategory[];
  error: string;
};

export type Loaded = {
  type: "Loaded";
  categories: ElementCategory[];
  batchstate: BatchImportElementsState;
  elements: EditableElement[];
};

export type EditableElement = {
  selected: boolean;
  name: string;
  categoryId: string;
  scanned: BatchScannedElement;
};
