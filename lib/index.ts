import { Grid, GridItem } from "./grid"
import { MonthItem, MonthTitle } from "./monthTitle"
import { getFirstDayOfYear } from "./util"

type CanvasGraphOptions = {
  grid: {
    size: number
    space: number
    defaultColor: string
    primaryColor: string
  },
  text: {
    color: string
    font: string
    height: number
  }
}

export class CalendarGraph {
  private offsetCellCount: number = 0
  private options: CanvasGraphOptions
  calendarWidth: number
  calendarHeight: number
  monthTitleData: MonthItem[]
  gridData: GridItem[]
  constructor(options: CanvasGraphOptions) {
    this.offsetCellCount = this.getOffsetCellCount()
    this.options = options
    this.init()
  }

  init() {
    this.monthTitleData = new MonthTitle({
      offsetCellCount: this.offsetCellCount,
      size: this.options.grid.size,
      space: this.options.grid.space,
      ...this.options.text
    }).monthTitleData
    let grid = new Grid(this.offsetCellCount, {
      offsetY: this.options.text.height,
      ...this.options.grid
    })
    this.gridData = grid.gridData
    this.calendarWidth = grid.width
    this.calendarHeight = grid.height + this.options.text.height
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

  static mergeData = Grid.mergeData

}



