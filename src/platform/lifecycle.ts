const resets = new Set<() => void>();
export function onSessionReset(reset: () => void) {
  resets.add(reset);
  return () => resets.delete(reset);
}
export function resetSessionViews() {
  resets.forEach(reset => reset());
}
