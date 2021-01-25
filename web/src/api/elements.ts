import { baseUrl } from "./server";

export type CreateElement = {
  categoryId: string;
  name: string;
  framecount: number;
  framerate: number;
  width: number;
  height: number;
  alpha: boolean;
};

export type Element = {
  id: string;
  name: string;
  framecount: number;
  framerate: number;
  alpha: boolean;
  previews: boolean;
  versions: ElementVersion[];
};

export type ElementVersion = {
  id: string;
  name: string;
  width: number;
  height: number;
};

export function listElements(): Promise<Element[]> {
  return fetch(baseUrl() + "/api/v1/elements", {
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

export function createElement(element: CreateElement): Promise<Element> {
  return fetch(baseUrl() + "/api/v1/elements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(element),
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Unexpected status");
    }
    return response.json();
  });
}

export function importFrame(
  elementId: string,
  frameNumber: number,
  exr: Blob
): Promise<void> {
  return fetch(
    baseUrl() + `/api/v1/elements/${elementId}/frames/${frameNumber}`,
    {
      method: "PUT",
      body: exr,
    }
  ).then((response) => {
    if (!response.ok) {
      throw new Error("Unexpected status");
    }
  });
}
