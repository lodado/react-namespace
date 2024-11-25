export function deepClone(value: any) {
  return JSON.parse(JSON.stringify(value))
}
