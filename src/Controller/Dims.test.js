import Dims from './Dims'

function createMockRef(dims) {
  return { getBoundingClientRect: () => dims }
}

const mockRefs = [
  createMockRef({ top: 0, bottom: 10 }),
  createMockRef({ top: 15, bottom: 35 })
]

test('offset swap', () => {
  const Items = new Dims(mockRefs)

  Items.swap(0, 1)

  expect(Items.items).toEqual([
    { start: 0, end: 10, offset: 25 },
    { start: 15, end: 35, offset: -15 }
  ])

  Items.swap(0, 1)

  expect(Items.items).toEqual([
    { start: 0, end: 10, offset: 0 },
    { start: 15, end: 35, offset: 0 }
  ])
})

test('offset merge', () => {
  const Items = new Dims(mockRefs)

  Items.swap(0, 1)
  Items.merge()

  expect(Items.items).toEqual([
    { start: 25, end: 35, offset: 0 },
    { start: 0, end: 20, offset: 0 }
  ])
})
