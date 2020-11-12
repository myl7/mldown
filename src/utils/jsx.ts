export const textize = (s: string) => {
  const braced = (m: string) => `{'${m}'}`
  return s
    .replace(/[{}]/g, braced)
    .replace(/[<>]/g, braced)
    .replace(/\n/g, braced)
    .replace(/(^ +)|( +$)/g, braced)
}
