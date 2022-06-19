import { Grid, GridItem } from "./grid";
import { getDayOfYear } from "./util";

export class TodayBoundary {
    todayBoundaryData: GridItem[]
    constructor(_grid: Grid, _opts: {
        size: number
        space: number
    }) {
        let todayOfYear = getDayOfYear(new Date())
        let { x, y } = _grid.getCellPostionByDay(todayOfYear)
        let topLeft = {
            x: x - _opts.space / 2,
            y: y - _opts.space / 2
        }
        let topRight = {
            x: x + _opts.size + _opts.space / 2,
            y: y - _opts.space / 2
        }
        let bottomLeft = {
            x: x - _opts.space / 2,
            y: y + _opts.size + _opts.space / 2
        }
        let bottomRight = {
            x: x + _opts.size + _opts.space / 2,
            y: y + _opts.size + _opts.space / 2
        }
        this.todayBoundaryData = [topLeft
            , topRight, bottomRight, bottomLeft]
    }
}