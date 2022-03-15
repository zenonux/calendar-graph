import { Grid, } from "./grid";
import { getLastWeekdaysOfMonth } from "./util";

export type MonthBoundaryItem = { x: number, y: number }[]
type BoundaryType = 'front' | 'end'
export class MonthBoundary {
    monthBoundaryData: MonthBoundaryItem[]
    private _topBoundaryData: MonthBoundaryItem = [];
    private _bottomBoundaryData: MonthBoundaryItem = [];
    constructor(private _grid: Grid, private _opts: {
        size: number
        space: number
    }) {
        let sideBoundaryData = this._getBoundarySideLines()
        let _topBoundaryData = this._topBoundaryData.sort((a, b) => {
            return a.x - b.x
        })
        let _bottomBoundaryData = this._bottomBoundaryData.sort((a, b) => {
            return a.x - b.x
        })
        this.monthBoundaryData = [
            ...sideBoundaryData,
            _topBoundaryData,
            _bottomBoundaryData,
        ]
    }
    private _getMonthBoundaryDays() {
        let boundary = []
        boundary.push({
            type: 'front',
            value: [1, 2, 3, 4, 5, 6, 7]
        })
        for (let i = 0; i < 12; i++) {
            boundary.push({
                type: 'end',
                value: getLastWeekdaysOfMonth(i)
            })
        }
        return boundary
    }
    private _getBoundaryLine(days: number[], type: BoundaryType) {
        let xDots = []
        let yDots = []
        let dots = []
        days.forEach(val => {
            let { x, y } = this._grid.getCellPostionByDay(val)
            if (type == 'end') {
                x = x + this._opts.size + this._opts.space;
            }
            xDots.push(x)
            yDots.push(y)
            yDots.push(y + this._opts.size)
            dots.push({
                x,
                y: y + this._opts.size
            })
            dots.push({
                x, y
            })
        })
        let xMin = Math.min(...xDots)
        let xMax = Math.max(...xDots)
        let yMin = Math.min(...yDots)
        let yMax = Math.max(...yDots)
        let middleDots = []
        // 是折线
        if (xMax != xMin) {
            dots = dots.sort((a, b) => {
                return a.y - b.y
            })
            let index = -1;
            for (let i = 0; i < dots.length; i++) {
                if (dots[i + 1].y - dots[i].y == this._opts.space && dots[i + 1].x != dots[i].x) {
                    index = i
                    break
                }
            }
            let middleDotTop =
            {
                ...dots[index],
                y: dots[index].y + this._opts.space / 2
            };
            let middleDotBottom =
            {
                ...dots[index + 1],
                y: dots[index + 1].y - this._opts.space / 2
            };
            middleDots = middleDotTop.x < middleDotBottom.x ? [middleDotTop, middleDotBottom] : [middleDotBottom, middleDotTop]
        }
        this._bottomBoundaryData.push({
            x: xMin,
            y: yMax
        })
        this._topBoundaryData.push({
            x: xMax,
            y: yMin
        })
        return [{
            x: xMin,
            y: yMax
        },
        ...middleDots,
        {
            x: xMax,
            y: yMin
        }]
    }



    private _getBoundarySideLines() {
        let days = this._getMonthBoundaryDays()
        return days.map(val => {
            return this._getBoundaryLine(val.value, val.type)
        })
    }
}