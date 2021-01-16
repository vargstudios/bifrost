export function baseUrl(): string {
  return window.location.origin.replace(":1234", ":3200");
}
