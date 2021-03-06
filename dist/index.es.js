var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
function isLeapYear(date = new Date()) {
  let year = date.getFullYear();
  if (year % 4 == 0 && year % 100 != 0 || year % 400 == 0) {
    return true;
  }
  return false;
}
function getFirstDayOfYear(date = new Date()) {
  return new Date(date.getFullYear(), 0, 1);
}
function getDayOfYear(date = new Date()) {
  const timestamp1 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const timestamp2 = Date.UTC(date.getFullYear(), 0, 0);
  const differenceInMilliseconds = timestamp1 - timestamp2;
  const differenceInDays = differenceInMilliseconds / 1e3 / 60 / 60 / 24;
  return differenceInDays;
}
function getLastWeekdaysOfMonth(month) {
  let days = [];
  let loop = 7;
  let lastDay = getLastDayOfMonth(month);
  while (loop) {
    days.push(getDayOfYear(lastDay) - loop + 1);
    loop--;
  }
  return days;
}
function getLastDayOfMonth(month) {
  return new Date(new Date().getFullYear(), month + 1, 0);
}
class Grid {
  constructor(offsetCellCount, options) {
    __publicField(this, "width");
    __publicField(this, "height");
    __publicField(this, "gridData");
    this.offsetCellCount = offsetCellCount;
    this.options = options;
    this.init();
  }
  init() {
    let totalDays = isLeapYear() ? 366 : 365;
    this.gridData = new Array(totalDays).fill(null).map((_val, index) => {
      return this.getCellPostionByDay(index + 1);
    });
    this.setGridWidthHeight(totalDays);
  }
  setGridWidthHeight(days) {
    let { size, space } = this.options;
    let column = Math.ceil((this.offsetCellCount + days) / 7);
    this.width = column * size + (column + 2) * space;
    this.height = 7 * size + 8 * space;
  }
  getCellPostionByDay(day) {
    let { size, space } = this.options;
    let [row, column] = this.getCellRowColumnByDay(day);
    let x = column * size + column * space + space;
    let y = this.options.offsetY + row * size + row * space + space;
    return { x, y };
  }
  getCellRowColumnByDay(day) {
    let { offsetCellCount } = this;
    let column = Math.ceil((day + offsetCellCount) / 7);
    let row = 7 - (7 * column - day - offsetCellCount);
    column = column - 1 > 0 ? column - 1 : 0;
    row = row - 1 > 0 ? row - 1 : 0;
    return [row, column];
  }
  static mergeData(gridData, data) {
    const dataTmp = data.reduce((target, v) => {
      let day = getDayOfYear(new Date(v.date)) - 1;
      target[day] = v;
      return target;
    }, {});
    for (let i = 0; i < gridData.length; i++) {
      gridData[i] = {
        ...gridData[i],
        ...dataTmp[i]
      };
    }
    return gridData;
  }
}
class MonthBoundary {
  constructor(_grid, _opts) {
    __publicField(this, "monthBoundaryData");
    __publicField(this, "_topBoundaryData", []);
    __publicField(this, "_bottomBoundaryData", []);
    this._grid = _grid;
    this._opts = _opts;
    let sideBoundaryData = this._getBoundarySideLines();
    let _topBoundaryData = this._topBoundaryData.sort((a, b) => {
      return a.x - b.x;
    });
    let _bottomBoundaryData = this._bottomBoundaryData.sort((a, b) => {
      return a.x - b.x;
    });
    this.monthBoundaryData = [
      ...sideBoundaryData,
      _topBoundaryData,
      _bottomBoundaryData
    ];
  }
  _getMonthBoundaryDays() {
    let boundary = [];
    boundary.push({
      type: "front",
      value: [1, 2, 3, 4, 5, 6, 7]
    });
    for (let i = 0; i < 12; i++) {
      boundary.push({
        type: "end",
        value: getLastWeekdaysOfMonth(i)
      });
    }
    return boundary;
  }
  _getBoundaryLine(days, type) {
    let xDots = [];
    let yDots = [];
    let dots = [];
    days.forEach((val) => {
      let { x, y } = this._grid.getCellPostionByDay(val);
      if (type == "end") {
        x = x + this._opts.size + this._opts.space / 2;
      } else {
        x = x - this._opts.space / 2;
      }
      xDots.push(x);
      yDots.push(y);
      yDots.push(y + this._opts.size);
      dots.push({
        x,
        y: y + this._opts.size
      });
      dots.push({
        x,
        y
      });
    });
    let xMin = Math.min(...xDots);
    let xMax = Math.max(...xDots);
    let yMin = Math.min(...yDots);
    let yMax = Math.max(...yDots);
    let middleDots = [];
    if (xMax != xMin) {
      dots = dots.sort((a, b) => {
        return a.y - b.y;
      });
      let index = -1;
      for (let i = 0; i < dots.length; i++) {
        if (dots[i + 1].y - dots[i].y == this._opts.space && dots[i + 1].x != dots[i].x) {
          index = i;
          break;
        }
      }
      let middleDotTop = {
        ...dots[index],
        y: dots[index].y + this._opts.space / 2
      };
      let middleDotBottom = {
        ...dots[index + 1],
        y: dots[index + 1].y - this._opts.space / 2
      };
      middleDots = middleDotTop.x < middleDotBottom.x ? [middleDotTop, middleDotBottom] : [middleDotBottom, middleDotTop];
    }
    this._bottomBoundaryData.push({
      x: xMin,
      y: yMax + this._opts.space / 2
    });
    this._topBoundaryData.push({
      x: xMax,
      y: yMin - this._opts.space / 2
    });
    return [
      {
        x: xMin,
        y: yMax
      },
      ...middleDots,
      {
        x: xMax,
        y: yMin
      }
    ];
  }
  _getBoundarySideLines() {
    let days = this._getMonthBoundaryDays();
    return days.map((val) => {
      return this._getBoundaryLine(val.value, val.type);
    });
  }
}
class MonthTitle {
  constructor(options) {
    __publicField(this, "monthTitleData");
    this.options = options;
    this._init();
  }
  _init() {
    this.monthTitleData = new Array(12).fill(null).map((_val, key) => {
      return this.getMonthTitleInfo(key);
    });
  }
  getMonthTitleInfo(month) {
    let { options } = this;
    let column = this._getMonthColumn(month, options.offsetCellCount);
    return {
      title: month + 1 + "\u6708",
      month,
      x: column * options.size + column * options.space + options.space / 2,
      y: options.titleHeight / 2
    };
  }
  _getMonthColumn(month, offsetCellCount) {
    let firstDay = new Date(new Date().getFullYear(), month, 1);
    let day = getDayOfYear(firstDay);
    let weekday = firstDay.getDay();
    let column = Math.ceil((day + offsetCellCount) / 7) - 1;
    if (weekday == 1) {
      return column;
    }
    return column + 1;
  }
}
class CanvasGraph {
  constructor(canvas, _options) {
    __publicField(this, "_context");
    __publicField(this, "_ratio");
    __publicField(this, "_isScaled", false);
    this._options = _options;
    this._context = canvas.getContext("2d");
    this._ratio = this.initRatio(_options.devicePixelRatio, this._context);
    canvas.width = _options.calendarWidth * this._ratio;
    canvas.height = _options.calendarHeight * this._ratio;
    this.render();
  }
  initRatio(devicePixelRatio, context) {
    devicePixelRatio = devicePixelRatio || window.devicePixelRatio || 1;
    let backingStoreRatio = context.webkitBackingStorePixelRatio || 1;
    return devicePixelRatio / backingStoreRatio;
  }
  render(data) {
    this._context.clearRect(0, 0, this._options.calendarWidth * this._ratio, this._options.calendarHeight * this._ratio);
    let { monthTitleData, gridData, monthBoundaryData, todayBoundaryData } = this._options;
    if (data && data.length > 0) {
      gridData = Grid.mergeData(gridData, data);
    }
    if (!this._isScaled) {
      this._context.scale(this._ratio, this._ratio);
      this._isScaled = true;
    }
    this.renderMonthTitle(monthTitleData);
    this.renderGrid(gridData);
    this.renderMonthBoundary(monthBoundaryData);
    this.renderTodayBoundary(todayBoundaryData);
  }
  renderMonthTitle(monthTitleData) {
    this._context.fillStyle = this._options.fontColor;
    this._context.font = this._options.font;
    this._context.textBaseline = "middle";
    this._context.textAlign = "left";
    monthTitleData.forEach((val) => {
      this._context.fillText(val.title, val.x, val.y);
    });
  }
  renderTodayBoundary(dots) {
    this._context.setLineDash([]);
    this._context.strokeStyle = this._options.borderColor;
    this._context.lineWidth = this._options.space / 2;
    this._context.beginPath();
    dots.forEach((item) => {
      this._context.lineTo(item.x, item.y);
    });
    this._context.closePath();
    this._context.stroke();
  }
  renderMonthBoundary(monthBoundaryData) {
    this._context.strokeStyle = this._options.borderColor;
    this._context.lineWidth = this._options.space / 2;
    this._context.beginPath();
    this._context.setLineDash([this._options.space * 2, this._options.space]);
    monthBoundaryData.forEach((val) => {
      this._context.moveTo(val[0].x, val[0].y);
      val.forEach((item) => {
        this._context.lineTo(item.x, item.y);
      });
    });
    this._context.stroke();
  }
  renderGrid(gridData) {
    gridData.forEach((val) => {
      this._context.fillStyle = this._options.colorFunc(val.count || 0);
      this._context.fillRect(val.x, val.y, this._options.size, this._options.size);
    });
  }
}
class TodayBoundary {
  constructor(_grid, _opts) {
    __publicField(this, "todayBoundaryData");
    let todayOfYear = getDayOfYear(new Date());
    let { x, y } = _grid.getCellPostionByDay(todayOfYear);
    let topLeft = {
      x: x - _opts.space / 2,
      y: y - _opts.space / 2
    };
    let topRight = {
      x: x + _opts.size + _opts.space / 2,
      y: y - _opts.space / 2
    };
    let bottomLeft = {
      x: x - _opts.space / 2,
      y: y + _opts.size + _opts.space / 2
    };
    let bottomRight = {
      x: x + _opts.size + _opts.space / 2,
      y: y + _opts.size + _opts.space / 2
    };
    this.todayBoundaryData = [
      topLeft,
      topRight,
      bottomRight,
      bottomLeft
    ];
  }
}
class CalendarGraph {
  constructor(_options) {
    __publicField(this, "canvasWidth");
    __publicField(this, "canvasHeight");
    __publicField(this, "_monthTitle");
    __publicField(this, "_grid");
    __publicField(this, "_canvasGraph");
    __publicField(this, "_monthBoundary");
    __publicField(this, "_todayBoundary");
    this._options = _options;
    this._init(_options);
  }
  _init(options) {
    let offsetCellCount = this.getOffsetCellCount();
    this._monthTitle = new MonthTitle({
      offsetCellCount,
      size: options.size,
      space: options.space,
      titleHeight: options.titleHeight
    });
    this._grid = new Grid(offsetCellCount, {
      offsetY: options.titleHeight,
      size: options.size,
      space: options.space
    });
    this.canvasWidth = this._grid.width;
    this.canvasHeight = this._grid.height + options.titleHeight;
    this._monthBoundary = new MonthBoundary(this._grid, {
      size: this._options.size,
      space: this._options.space
    });
    this._todayBoundary = new TodayBoundary(this._grid, {
      size: this._options.size,
      space: this._options.space
    });
  }
  setCanvas(canvas) {
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
      borderColor: this._options.borderColor
    });
  }
  getMonthTitleInfo(month) {
    return this._monthTitle.getMonthTitleInfo(month);
  }
  getOffsetCellCount() {
    let offsetCellCount = 0;
    let firstDayOfWeek = getFirstDayOfYear().getDay();
    if (firstDayOfWeek == 0) {
      offsetCellCount = 6;
    } else {
      offsetCellCount = firstDayOfWeek - 1;
    }
    return offsetCellCount;
  }
  render(data) {
    this._canvasGraph.render(data);
  }
}
export { CalendarGraph };
