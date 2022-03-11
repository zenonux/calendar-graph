import { getDayOfYear, isLeapYear } from "./util"

export type DataItem = {
    date: string
    count: number
}

type GridOptions = {
    offsetY: number
    size: number
    space: number
    defaultColor: string
    primaryColor: string
}

export type GridItem = {
    x: number
    y: number
    count?: number
    date?: string
}


export class Grid {
    width: number
    height: number
    gridData: GridItem[]
    constructor(private offsetCellCount: number, private options: GridOptions) {
        this.init()
    }
    init() {
        let totalDays = isLeapYear() ? 366 : 365
        this.gridData = new Array(totalDays).fill(null).map((_val, index: number) => {
            return this.getCellPostionByDay(index + 1)
        })
        this.setGridWidthHeight(totalDays)
    }


    setGridWidthHeight(days: number) {
        let { size, space } = this.options
        let column = Math.ceil((this.offsetCellCount + days) / 7)
        this.width = column * size + (column - 1) * space
        this.height = 7 * size + 6 * space
    }

    getCellPostionByDay(day: number) {
        let { size, space } = this.options
        let [row, column] = this.getCellRowColumnByDay(day)
        let x = column * size + column * space;
        let y = this.options.offsetY + row * size + row * space;
        return { x, y }
    }


    private getCellRowColumnByDay(day: number) {
        let { offsetCellCount } = this
        let column = Math.ceil((day + offsetCellCount) / 7)
        let row = 7 - (7 * column - day - offsetCellCount)
        // 获取下标
        column = column - 1 > 0 ? column - 1 : 0
        row = row - 1 > 0 ? row - 1 : 0
        return [row, column]
    }

    static mergeData(gridData: GridItem[], data: DataItem[]) {
        const dataTmp = data.reduce((target, v) => {
            let day = getDayOfYear(new Date(v.date))
            target[day] = v;
            return target;
        }, {});
        for (let i = 0; i < gridData.length; i++) {
            gridData[i] = {
                ...gridData[i],
                ...dataTmp[i]
            }
        }
        return gridData
    }
}