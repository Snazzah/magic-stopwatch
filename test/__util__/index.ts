export function wait(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
