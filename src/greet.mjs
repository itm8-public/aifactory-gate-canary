/** A greeting for a name. Synthetic canary code. */
export function greet(name) {
  return `Hello, ${String(name).trim() || 'there'}!`;
}
