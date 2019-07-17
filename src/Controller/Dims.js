import { KEYWORDS } from '../consts'

class Dims {
  constructor(refs, horizontal = false) {
    this.setDims(refs, horizontal)
  }

  setDims = (refs, horizontal) => {
    this.setKeywords(horizontal)
    this.setItems(refs)
  }

  setKeywords = horizontal => {
    this.keywords = horizontal ? KEYWORDS.HORIZONTAL : KEYWORDS.VERTICAL
  }

  setItems = refs => {
    const { start, end } = this.keywords

    this.items = refs.map(ref => {
      const rect = ref.getBoundingClientRect()
      return {
        start: rect[start],
        end: rect[end],
        offset: 0
      }
    })
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
}

export default Dims
