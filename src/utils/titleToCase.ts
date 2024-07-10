export function titleNameToCase(inputString: string): string {
  const parts = inputString.split(/(?=[A-Z])/)
  const result = parts.map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
  return result
}
