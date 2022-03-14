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
    constructor(options: MonthOptions) {
        this.init(options)
    }
    init(options: MonthOptions) {
        this.monthTitleData = new Array(12).fill(null).map((_val, key) => {
            let column = this.getMonthColumn(key, options.offsetCellCount);
            return {
                title: key + 1 + '月',
                x: column * options.size + column * options.space,
                y: options.titleHeight / 2,
            }
        })
    }
    getMonthColumn(month: number, offsetCellCount: number) {
        let firstDay = new Date(
            new Date().getFullYear(),
            month,
            1 + offsetCellCount
        )
        let day = getDayOfYear(firstDay)
        let weekday = firstDay.getDay()
        let column = Math.ceil(day / 7) - 1
        // 第一天就是周一
        if (weekday == 1) {
            return column
        }
        return column + 1
    }
}
