export const inRange = (n, min, max) => {
  if (min > max) { [min, max] = [max, min] }
  return n >= min && n <= max
}

export const shiftArray = (array, index, step) => {
  const toShift = array.splice(index, 1)[0]
  array.splice(index + step, 0, toShift)
}
