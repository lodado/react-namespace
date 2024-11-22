export function deepClone(value: any) {
  // @ts-ignore
  return global.structuredClone ? structuredClone?.(value) : JSON.parse(JSON.stringify(value))
}
