import { DataItem, Grid, } from "./grid"
import { MonthTitle } from "./monthTitle"
import { CanvasGraph } from "./render"
import { getFirstDayOfYear } from "./util"

type CanvasGraphOptions = {
  font: string
  fontColor: string
  titleHeight: number
  size: number
  space: number
  colorFunc: (count: number) => string
}

export class CalendarGraph {
  canvasWidth: number
  canvasHeight: number
  private _canvasGraph: CanvasGraph;
  constructor(canvas: HTMLCanvasElement, options: CanvasGraphOptions) {
    this._canvasGraph = this.init(canvas, options)
  }

  init(canvas: HTMLCanvasElement, options: CanvasGraphOptions) {
    let offsetCellCount = this.getOffsetCellCount()

    let month = new MonthTitle({
      offsetCellCount: offsetCellCount,
      size: options.size,
      space: options.space,
      titleHeight: options.titleHeight
    })
    let grid = new Grid(offsetCellCount, {
      offsetY: options.titleHeight,
      size: options.size,
      space: options.space,
    })
    this.canvasWidth = grid.width
    this.canvasHeight = grid.height + options.titleHeight
    return new CanvasGraph(canvas, {
      calendarWidth: this.canvasWidth,
      calendarHeight: this.canvasHeight,
      gridData: grid.gridData,
      monthTitleData: month.monthTitleData,
      size: options.size,
      font: options.font,
      colorFunc: options.colorFunc,
      fontColor: options.fontColor
    })
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



