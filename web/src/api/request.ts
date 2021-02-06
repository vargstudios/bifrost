import { Error, jsonError, networkError } from "./error";
import { baseUrl } from "./server";

export function post<T>(path: string, data: any): Promise<T> {
  return request(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

export function get<T>(path: string): Promise<T> {
  return request(path, { method: "GET" });
}

export function del<T>(path: string): Promise<T> {
  return request(path, { method: "DELETE" });
}

export function request<T>(path: string, init: RequestInit): Promise<T> {
  return fetch(baseUrl() + path, init)
    .catch((error: any) => {
      throw networkError(error);
    })
    .then((response: Response) => {
      return response
        .json()
        .catch((error: any) => {
          throw jsonError(error);
        })
        .then((json: any) => {
          if (!response.ok) {
            throw json as Error;
          } else {
            return json as T;
          }
        });
    });
}
