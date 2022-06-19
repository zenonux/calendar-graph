import { DataItem, Grid } from './grid'
import { MonthBoundary } from './monthBoundary'
import { MonthTitle } from './monthTitle'
import { CanvasGraph } from './render'
import { TodayBoundary } from './todayBoundary'
import { getFirstDayOfYear } from './util'

type CanvasGraphOptions = {
  devicePixelRatio: number
  font: string
  fontColor: string
  borderColor: string
  titleHeight: number
  size: number
  space: number
  colorFunc: (count: number) => string
}

export class CalendarGraph {
  canvasWidth: number
  canvasHeight: number
  private _monthTitle: MonthTitle
  private _grid: Grid
  private _canvasGraph: CanvasGraph
  private _monthBoundary: MonthBoundary
  private _todayBoundary: TodayBoundary
  constructor(private _options: CanvasGraphOptions) {
    this._init(_options)
  }

  _init(options: CanvasGraphOptions) {
    let offsetCellCount = this.getOffsetCellCount()
    this._monthTitle = new MonthTitle({
      offsetCellCount: offsetCellCount,
      size: options.size,
      space: options.space,
      titleHeight: options.titleHeight,
    })
    this._grid = new Grid(offsetCellCount, {
      offsetY: options.titleHeight,
      size: options.size,
      space: options.space,
    })
    this.canvasWidth = this._grid.width
    this.canvasHeight = this._grid.height + options.titleHeight
    this._monthBoundary = new MonthBoundary(this._grid, {
      size: this._options.size,
      space: this._options.space,
    })
    this._todayBoundary = new TodayBoundary(this._grid, {
      size: this._options.size,
      space: this._options.space,
    })
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this._canvasGraph = new CanvasGraph(canvas, {
      devicePixelRatio: this._options.devicePixelRatio,
      calendarWidth: this.canvasWidth,
      calendarHeight: this.canvasHeight,
      gridData: this._grid.gridData,
      monthTitleData: this._monthTitle.monthTitleData,
      monthBoundaryData: this._monthBoundary.monthBoundaryData,
      todayBoundaryData: this._todayBoundary.todayBoundaryData,
      size: this._options.size,
      space: this._options.space,
      font: this._options.font,
      colorFunc: this._options.colorFunc,
      fontColor: this._options.fontColor,
      borderColor: this._options.borderColor,
    })
  }

  getMonthTitleInfo(month: number) {
    return this._monthTitle.getMonthTitleInfo(month)
  }

  // 单元格从左到右，从上到下进行偏移, 确保每年的第一天和星期几对应
  private getOffsetCellCount() {
    let offsetCellCount = 0
    let firstDayOfWeek = getFirstDayOfYear().getDay()
    // 周日向下偏移6个单元格
    if (firstDayOfWeek == 0) {
      offsetCellCount = 6
    } else {
      offsetCellCount = firstDayOfWeek - 1
    }
    return offsetCellCount
  }

  render(data: DataItem[]) {
    this._canvasGraph.render(data)
  }
}
