// split an array into chunks of a given size
export function chunkArray<T>(arr: T[], size: number): T[][] {
  const res = []

  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size))
  }

  return res
}
