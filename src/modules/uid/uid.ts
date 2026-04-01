export const uid = (): string => {
  const array = new Uint8Array(10);
  globalThis.crypto.getRandomValues(array);
  return Array.from(array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
