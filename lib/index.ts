import { MonthTitle } from "./monthTitle"
import { getFirstDayOfYear, getDayOfYear, getHexOpacityColor, isLeapYear } from "./util"

type DataItem = {
  date: string
  count: number
}

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
  private context: CanvasRenderingContext2D
  private options: CanvasGraphOptions
  private gridWidth: number
  private gridHeight: number
  constructor(canvas: HTMLCanvasElement, options: CanvasGraphOptions) {
    this.offsetCellCount = this.getOffsetCellCount()
    this.context = canvas.getContext('2d')
    this.options = options
    this.draw()
  }

  draw() {
    new MonthTitle(this.context, {
      height: this.options.text.height,
      size: this.options.grid.size,
      offsetCellCount: this.offsetCellCount,
      space: this.options.grid.space,
      ...this.options.text
    })
    this.drawGrid()
  }

  render(data?: DataItem[]) {
    this.context.clearRect(0, this.options.text.height, this.gridWidth, this.gridHeight)
    this.drawGrid(data)
  }


  setGridWidthHeight(days: number) {
    let { size, space } = this.options.grid
    let column = Math.ceil((this.offsetCellCount + days) / 7)
    this.gridWidth = column * size + (column - 1) * space
    this.gridHeight = 7 * size + 6 * space
  }

  drawGrid(data?: DataItem[]) {
    let totalDays = isLeapYear() ? 366 : 365
    let days = new Array(totalDays).fill(null)
    if (!this.gridWidth) {
      this.setGridWidthHeight(totalDays)
    }
    if (data) {
      const dataTmp = data.reduce((target, v) => {
        let day = getDayOfYear(new Date(v.date))
        target[day] = v;
        return target;
      }, {});
      for (let i = 0; i < days.length; i++) {
        days[i] = dataTmp[i]
      }
    }
    days.forEach((val: any, key: number) => {
      this.drawRect(key + 1, val ? val.count : 0)
    })
  }

  drawRect(index: number, count: number) {
    let { size, space, defaultColor, primaryColor } = this.options.grid
    let [row, column] = this.getDayCellRowColumn(index)
    let x = column * size + column * space;
    let y = row * size + row * space;
    let color = defaultColor
    if (count > 2) {
      color = primaryColor
    } else if (count == 2) {
      color = getHexOpacityColor(primaryColor, 0.8)
    } else if (count == 1) {
      color = getHexOpacityColor(primaryColor, 0.5)
    }
    this.context.fillStyle = color
    this.context.fillRect(x, this.options.text.height + y, size, size)
  }

  private getDayCellRowColumn(day: number) {
    let { offsetCellCount } = this
    let column = Math.ceil((day + offsetCellCount) / 7)
    let row = 7 - (7 * column - day - offsetCellCount)
    // 获取下标
    column = column - 1 > 0 ? column - 1 : 0
    row = row - 1 > 0 ? row - 1 : 0
    return [row, column]
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

}

