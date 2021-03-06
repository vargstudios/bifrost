import { del, get, post, put } from "./request";

export type CreateElementCategory = {
  name: string;
};

export type UpdateElementCategory = {
  name: string;
};

export type ElementCategory = {
  id: string;
  name: string;
  elements: number;
};

export function listCategories(): Promise<ElementCategory[]> {
  return get("/api/v1/element-categories");
}

export function createCategory(
  category: CreateElementCategory
): Promise<ElementCategory> {
  return post("/api/v1/element-categories", category);
}

export function updateCategory(
  id: string,
  category: UpdateElementCategory
): Promise<void> {
  return put("/api/v1/element-categories/" + id, category);
}

export function deleteCategory(id: string): Promise<void> {
  return del("/api/v1/element-categories/" + id);
}
