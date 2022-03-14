import { DataItem, Grid, GridItem } from "./grid";
import { MonthTitleItem } from "./monthTitle";

type CanvasGraphOptions = {
    colorFunc: (count: number) => string
    size: number
    font: string
    fontColor: string
    monthTitleData: MonthTitleItem[]
    gridData: GridItem[]
    calendarWidth: number
    calendarHeight: number
}

export class CanvasGraph {
    private context: CanvasRenderingContext2D
    constructor(canvas: HTMLCanvasElement, private options: CanvasGraphOptions) {
        this.context = canvas.getContext('2d')
        canvas.width = options.calendarWidth
        canvas.height = options.calendarHeight
        this.render()
    }

    render(data?: DataItem[]) {
        this.context.clearRect(0, 0, this.options.calendarWidth, this.options.calendarHeight)
        let { monthTitleData, gridData } = this.options
        if (data && data.length > 0) {
            gridData = Grid.mergeData(gridData, data)
        }
        this.renderMonthTitle(monthTitleData)
        this.renderGrid(gridData)
    }

    renderMonthTitle(monthTitleData: MonthTitleItem[]) {
        this.context.fillStyle = this.options.fontColor
        this.context.font = this.options.font
        this.context.textBaseline = 'middle'
        monthTitleData.forEach(val => {
            this.context.fillText(val.title, val.x, val.y)
        })
    }

    renderGrid(gridData: GridItem[]) {
        gridData.forEach(val => {
            this.context.fillStyle = this.options.colorFunc(val.count || 0)
            this.context.fillRect(val.x, val.y, this.options.size, this.options.size)
        })
    }

}