import { getDayOfYear } from './util'

type MonthItem = {
    title: string
    column: number
}
type MonthOptions = {
    height: number
    size: number
    offsetCellCount: number
    space: number
    font: string
    color: string
}
export class MonthTitle {
    data: MonthItem[]
    constructor(context: CanvasRenderingContext2D, options: MonthOptions) {
        this.init(context, options)
    }
    init(context: CanvasRenderingContext2D, options: MonthOptions) {
        let data = new Array(12).fill(null).map((_val, key) => {
            return {
                title: key + 1 + '月',
                column: this.getMonthColumn(key, options.offsetCellCount),
            }
        })
        this.render(context, data, options)
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
    render(
        context: CanvasRenderingContext2D,
        data: MonthItem[],
        opts: {
            height: number
            size: number
            space: number
            font: string
            color: string
        }
    ) {
        let arr = data.map((val, key) => {
            return {
                title: val.title,
                x: val.column * opts.size + (val.column - 1 > 0 ? val.column - 1 : 0) * opts.space,
                y: opts.height / 2,
            }
        })
        arr.forEach((val) => {
            this.drawText(context, val.title, val.x, val.y, opts.font, opts.color)
        })
    }
    drawText(
        context: CanvasRenderingContext2D,
        text: string,
        x: number,
        y: number,
        font: string,
        color: string
    ) {
        context.font = font
        context.fillStyle = color
        context.textBaseline = 'middle'
        context.fillText(text, x, y)
    }
}
