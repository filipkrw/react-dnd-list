class Dims {
  constructor(items) {
    this.setAll(items)
  }

  swap = (indexA, indexB) => {
    let a = this.items[indexA]
    let b = this.items[indexB]

    if (a.start + a.offset > b.start + b.offset) {
      [a, b] = [b, a]
    }

    const aMove = (b.end + b.offset) - (a.end + a.offset)
    const bMove = (b.start + b.offset) - (a.start + a.offset)

    a.offset += aMove
    b.offset -= bMove
  }

  merge = () => {
    this.items.forEach(item => {
      item.start += item.offset
      item.end += item.offset
      item.offset = 0
    })
  }

  setAll = items => this.items = items
  getAll = () => this.items
}

export default Dims
