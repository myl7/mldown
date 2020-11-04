import entities from './entities.json'

export default (src: string): string => {
  let res = src

  res = res.replace(/&([a-zA-Z]+);/g, (pre, entityName) => {
    // @ts-ignore
    const entity = entities[entityName]
    if (entity) {
      return entity
    }
    return pre
  })

  res = res.replace(/&#([0-9]+);/g, (_, s) => {
    return String.fromCharCode(parseInt(s))
  })

  res = res.replace(/&#[Xx]([0-9a-f]+);/g, (_, s) => {
    return String.fromCharCode(parseInt(s, 16))
  })

  return res
}
