import { baseUrl } from "./server";

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

export function getElement(id: string): Promise<Element> {
  return fetch(baseUrl() + "/api/v1/elements/" + id, {
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
