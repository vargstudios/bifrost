import { useEffect } from "react";

export function useKeyDown(listener: (e: KeyboardEvent) => void): void {
  useEffect(() => {
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [listener]);
}
