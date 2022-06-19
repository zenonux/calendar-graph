import { getDayOfYear } from './util'

export type MonthTitleItem = {
  title: string
  x: number
  y: number
}
type MonthOptions = {
  titleHeight: number
  size: number
  offsetCellCount: number
  space: number
}
export class MonthTitle {
  monthTitleData: MonthTitleItem[]
  constructor(private options: MonthOptions) {
    this._init()
  }
  _init() {
    this.monthTitleData = new Array(12).fill(null).map((_val, key) => {
      return this.getMonthTitleInfo(key)
    })
  }
  getMonthTitleInfo(month: number) {
    let { options } = this
    let column = this._getMonthColumn(month, options.offsetCellCount)
    return {
      title: month + 1 + '月',
      month: month,
      x: column * options.size + column * options.space + options.space / 2,
      y: options.titleHeight / 2,
    }
  }
  _getMonthColumn(month: number, offsetCellCount: number) {
    let firstDay = new Date(new Date().getFullYear(), month, 1)
    let day = getDayOfYear(firstDay)
    let weekday = firstDay.getDay()

    let column = Math.ceil((day + offsetCellCount) / 7) - 1
    // 第一天就是周一
    if (weekday == 1) {
      return column
    }
    return column + 1
  }
}
