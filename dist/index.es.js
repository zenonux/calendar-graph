var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
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
    this.width = column * size + (column - 1) * space;
    this.height = 7 * size + 6 * space;
  }
  getCellPostionByDay(day) {
    let { size, space } = this.options;
    let [row, column] = this.getCellRowColumnByDay(day);
    let x = column * size + column * space;
    let y = this.options.offsetY + row * size + row * space;
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
      let day = getDayOfYear(new Date(v.date));
      target[day] = v;
      return target;
    }, {});
    for (let i = 0; i < gridData.length; i++) {
      gridData[i] = __spreadValues(__spreadValues({}, gridData[i]), dataTmp[i]);
    }
    return gridData;
  }
}
class MonthTitle {
  constructor(options) {
    __publicField(this, "monthTitleData");
    this.init(options);
  }
  init(options) {
    this.monthTitleData = new Array(12).fill(null).map((_val, key) => {
      let column = this.getMonthColumn(key, options.offsetCellCount);
      return {
        title: key + 1 + "\u6708",
        x: column * options.size + (column - 1 > 0 ? column - 1 : 0) * options.space,
        y: 0
      };
    });
  }
  getMonthColumn(month, offsetCellCount) {
    let firstDay = new Date(new Date().getFullYear(), month, 1 + offsetCellCount);
    let day = getDayOfYear(firstDay);
    let weekday = firstDay.getDay();
    let column = Math.ceil(day / 7) - 1;
    if (weekday == 1) {
      return column;
    }
    return column + 1;
  }
}
class CalendarGraph {
  constructor(options) {
    __publicField(this, "offsetCellCount", 0);
    __publicField(this, "options");
    __publicField(this, "calendarWidth");
    __publicField(this, "calendarHeight");
    __publicField(this, "monthTitleData");
    __publicField(this, "gridData");
    this.offsetCellCount = this.getOffsetCellCount();
    this.options = options;
    this.init();
  }
  init() {
    this.monthTitleData = new MonthTitle({
      offsetCellCount: this.offsetCellCount,
      size: this.options.size,
      space: this.options.space
    }).monthTitleData;
    let grid = new Grid(this.offsetCellCount, {
      offsetY: this.options.titleHeight,
      size: this.options.size,
      space: this.options.space
    });
    this.gridData = grid.gridData;
    this.calendarWidth = grid.width;
    this.calendarHeight = grid.height + this.options.titleHeight;
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
}
__publicField(CalendarGraph, "mergeData", Grid.mergeData);
export { CalendarGraph };
