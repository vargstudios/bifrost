import { useLocation } from "react-router-dom";

type Query = {
  get: (key: string) => string | null;
  set: (key: string, value: string) => Query;
  del: (key: string) => Query;
  has: (key: string, value: string | null) => boolean;
  toString: () => string;
};

export function useQuery(): Query {
  const location = useLocation();
  return toQuery(location.search);
}

function toQuery(search: string): Query {
  return {
    get: (key) => {
      const params = new URLSearchParams(search);
      return params.get(key);
    },
    set: (key, value) => {
      const params = new URLSearchParams(search);
      params.set(key, value);
      return toQuery(params.toString());
    },
    del: (key) => {
      const params = new URLSearchParams(search);
      params.delete(key);
      return toQuery(params.toString());
    },
    has: (key, value) => {
      const params = new URLSearchParams(search);
      return params.get(key) === value;
    },
    toString: () => {
      return "?" + search;
    },
  };
}
