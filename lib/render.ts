import { DataItem, Grid, GridItem } from "./grid";
import { MonthTitleItem } from "./monthTitle";

type CanvasGraphOptions = {
    devicePixelRatio: number
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
    private _context: any
    private _ratio: number
    constructor(canvas: HTMLCanvasElement, private options: CanvasGraphOptions) {
        this._context = canvas.getContext('2d')
        this._ratio = this.initRatio(options.devicePixelRatio, this._context)
        canvas.width = options.calendarWidth * this._ratio
        canvas.height = options.calendarHeight * this._ratio
        this.render()
    }
    initRatio(devicePixelRatio: number, context: any) {
        devicePixelRatio = devicePixelRatio || window.devicePixelRatio || 1;
        let backingStoreRatio = context.webkitBackingStorePixelRatio || 1;
        return devicePixelRatio / backingStoreRatio;
    }

    render(data?: DataItem[]) {
        this._context.clearRect(0, 0, this.options.calendarWidth, this.options.calendarHeight)
        let { monthTitleData, gridData } = this.options
        if (data && data.length > 0) {
            gridData = Grid.mergeData(gridData, data)
        }
        this.renderMonthTitle(monthTitleData)
        this.renderGrid(gridData)
        this._context.scale(this._ratio, this._ratio);
    }

    renderMonthTitle(monthTitleData: MonthTitleItem[]) {
        this._context.fillStyle = this.options.fontColor
        this._context.font = this.options.font
        this._context.textBaseline = 'middle'
        monthTitleData.forEach(val => {
            this._context.fillText(val.title, val.x, val.y)
        })
    }

    renderGrid(gridData: GridItem[]) {
        gridData.forEach(val => {
            this._context.fillStyle = this.options.colorFunc(val.count || 0)
            this._context.fillRect(val.x, val.y, this.options.size, this.options.size)
        })
    }

}