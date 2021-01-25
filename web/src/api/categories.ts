import { baseUrl } from "./server";

export type CreateCategory = {
  name: string;
};

export type Category = {
  id: string;
  name: string;
};

export function listCategories(): Promise<Category[]> {
  return fetch(baseUrl() + "/api/v1/categories", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Unexpected status");
    }
    return response.json();
  });
}

export function createCategory(category: CreateCategory): Promise<Category> {
  return fetch(baseUrl() + "/api/v1/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Unexpected status");
    }
    return response.json();
  });
}
