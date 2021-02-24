import { del, get, post, put, request } from "./request";

export type CreateElement = {
  categoryId: string;
  name: string;
  framecount: number;
  framerate: number;
  width: number;
  height: number;
  channels: string;
  alpha: boolean;
};

export type Element = {
  id: string;
  name: string;
  framecount: number;
  framerate: number;
  channels: string;
  alpha: boolean;
  previews: boolean;
  versions: ElementVersion[];
  category: ElementCategory;
};

export type ElementVersion = {
  id: string;
  name: string;
  width: number;
  height: number;
  url: string;
};

export type ElementCategory = {
  id: string;
  name: string;
};

export function listElements(): Promise<Element[]> {
  return get("/api/v1/elements");
}

export function getElement(id: string): Promise<Element> {
  return get("/api/v1/elements/" + id);
}

export function createElement(element: CreateElement): Promise<Element> {
  return post("/api/v1/elements", element);
}

export function renameElement(id: string, name: string): Promise<void> {
  return put("/api/v1/elements/" + id + "/name", { value: name });
}

export function deleteElement(id: string): Promise<void> {
  return del("/api/v1/elements/" + id);
}

export function importFrame(
  elementId: string,
  frameNumber: number,
  exr: Blob
): Promise<void> {
  return request(`/api/v1/elements/${elementId}/frames/${frameNumber}`, {
    method: "PUT",
    headers: {
      "Content-Type": "image/x-exr",
    },
    body: exr,
  });
}
