import Dims from './Dims'

test('offset swap', () => {
  const Items = new Dims([
    { start: 0, end: 10, offset: 0 },
    { start: 15, end: 35, offset: 0 }
  ])

  Items.swap(0, 1)

  expect(Items.getAll()).toEqual([
    { start: 0, end: 10, offset: 25 },
    { start: 15, end: 35, offset: -15 }
  ])

  Items.swap(0, 1)

  expect(Items.getAll()).toEqual([
    { start: 0, end: 10, offset: 0 },
    { start: 15, end: 35, offset: 0 }
  ])
})

test('offset merge', () => {
  const Items = new Dims([
    { start: 0, end: 10, offset: 0 },
    { start: 15, end: 35, offset: 0 }
  ])

  Items.swap(0, 1)
  Items.merge()

  expect(Items.getAll()).toEqual([
    { start: 25, end: 35, offset: 0 },
    { start: 0, end: 20, offset: 0 }
  ])
})
