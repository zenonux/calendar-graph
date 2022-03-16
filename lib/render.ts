import { DataItem, Grid, GridItem } from "./grid";
import { MonthBoundaryItem } from "./monthBoundary";
import { MonthTitleItem } from "./monthTitle";

type CanvasGraphOptions = {
    borderColor: string
    devicePixelRatio: number
    colorFunc: (count: number) => string
    size: number
    space: number
    font: string
    fontColor: string
    monthTitleData: MonthTitleItem[]
    monthBoundaryData: MonthBoundaryItem[],
    gridData: GridItem[]
    calendarWidth: number
    calendarHeight: number
}

export class CanvasGraph {
    private _context: CanvasRenderingContext2D
    private _ratio: number
    constructor(canvas: HTMLCanvasElement, private _options: CanvasGraphOptions) {
        this._context = canvas.getContext('2d')
        this._ratio = this.initRatio(_options.devicePixelRatio, this._context)
        canvas.width = _options.calendarWidth * this._ratio
        canvas.height = _options.calendarHeight * this._ratio
        this.render()
    }
    initRatio(devicePixelRatio: number, context: any) {
        devicePixelRatio = devicePixelRatio || window.devicePixelRatio || 1;
        let backingStoreRatio = context.webkitBackingStorePixelRatio || 1;
        return devicePixelRatio / backingStoreRatio;
    }

    render(data?: DataItem[]) {
        this._context.clearRect(0, 0, this._options.calendarWidth * this._ratio, this._options.calendarHeight * this._ratio)
        let { monthTitleData, gridData, monthBoundaryData } = this._options
        if (data && data.length > 0) {
            gridData = Grid.mergeData(gridData, data)
        }
        this.renderMonthTitle(monthTitleData)
        this.renderGrid(gridData)
        this.renderMonthBoundary(monthBoundaryData)
        this._context.scale(this._ratio, this._ratio);
    }

    renderMonthTitle(monthTitleData: MonthTitleItem[]) {
        this._context.fillStyle = this._options.fontColor
        this._context.font = this._options.font
        this._context.textBaseline = 'middle'
        monthTitleData.forEach(val => {
            this._context.fillText(val.title, val.x, val.y)
        })
    }

    renderMonthBoundary(monthBoundaryData: MonthBoundaryItem[]) {
        this._context.strokeStyle = this._options.borderColor
        this._context.lineWidth = this._options.space
        this._context.beginPath()
        this._context.setLineDash([this._options.space * 2,this._options.space])
        monthBoundaryData.forEach(val => {
            this._context.moveTo(val[0].x, val[0].y)
            val.forEach((item) => {
                this._context.lineTo(item.x, item.y)
            })
        })
        this._context.stroke()
        this._context.closePath()
    }

    renderGrid(gridData: GridItem[]) {
        gridData.forEach(val => {
            this._context.fillStyle = this._options.colorFunc(val.count || 0)
            this._context.fillRect(val.x, val.y, this._options.size, this._options.size)
        })
    }

}