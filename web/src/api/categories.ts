import { del, get, post } from "./request";

export type CreateCategory = {
  name: string;
};

export type Category = {
  id: string;
  name: string;
};

export function listCategories(): Promise<Category[]> {
  return get("/api/v1/categories");
}

export function createCategory(category: CreateCategory): Promise<Category> {
  return post("/api/v1/categories", category);
}

export function deleteCategory(id: string): Promise<void> {
  return del("/api/v1/categories/" + id);
}
