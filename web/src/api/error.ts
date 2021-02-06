export type Error = {
  code: number;
  reason: string;
  details: string;
};

export function networkError(error: any): Error {
  return {
    code: 600,
    reason: "Network Error",
    details: error.toString(),
  };
}

export function jsonError(error: any): Error {
  return {
    code: 601,
    reason: "Invalid JSON",
    details: error.toString(),
  };
}
