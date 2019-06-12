export const inRange = (n, min, max) => {
  if (min > max) { [min, max] = [max, min] }
  return n >= min && n <= max
}

export const arrayShift = (array, index, step) => {
  const newArray = [...array]

  const toShift = newArray.splice(index, 1)[0]
  newArray.splice(index + step, 0, toShift)

  return newArray
}
