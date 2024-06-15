export const getUniqueValues = (arr: any[]) => {
  return Array.from(new Set(arr))
}

export const checkArrayEquality = (arr1: any[], arr2: any[]) => {
  if (arr1.length !== arr2.length)
    return false

  const sortedArr1 = arr1.slice().sort()
  const sortedArr2 = arr2.slice().sort()
  
  return JSON.stringify(sortedArr1) === JSON.stringify(sortedArr2)
}