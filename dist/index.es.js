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
function getHexOpacityColor(color = "#000", opacity = 0.5) {
  opacity = Math.max(opacity, 0);
  opacity = Math.min(opacity, 1);
  color = color.replace(/\#/g, "").toUpperCase();
  if (color.length === 3) {
    let arr = color.split("");
    color = "";
    for (let i = 0; i < arr.length; i++) {
      color += arr[i] + arr[i];
    }
  }
  let num = Math.round(255 * opacity);
  let str = "";
  let arrHex = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
  while (num > 0) {
    let mod = num % 16;
    num = (num - mod) / 16;
    str = arrHex[mod] + str;
  }
  if (str.length == 1)
    str = "0" + str;
  if (str.length == 0)
    str = "00";
  return `#${color + str}`;
}
class MonthTitle {
  constructor(context, options) {
    __publicField(this, "data");
    this.init(context, options);
  }
  init(context, options) {
    let data = new Array(12).fill(null).map((_val, key) => {
      return {
        title: key + 1 + "\u6708",
        column: this.getMonthColumn(key, options.offsetCellCount)
      };
    });
    this.render(context, data, options);
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
  render(context, data, opts) {
    let arr = data.map((val, key) => {
      return {
        title: val.title,
        x: val.column * opts.size + (val.column - 1 > 0 ? val.column - 1 : 0) * opts.space,
        y: opts.height / 2
      };
    });
    arr.forEach((val) => {
      this.drawText(context, val.title, val.x, val.y, opts.font, opts.color);
    });
  }
  drawText(context, text, x, y, font, color) {
    context.font = font;
    context.fillStyle = color;
    context.textBaseline = "middle";
    context.fillText(text, x, y);
  }
}
class CalendarGraph {
  constructor(canvas, options) {
    __publicField(this, "offsetCellCount", 0);
    __publicField(this, "context");
    __publicField(this, "options");
    __publicField(this, "gridWidth");
    __publicField(this, "gridHeight");
    this.offsetCellCount = this.getOffsetCellCount();
    this.context = canvas.getContext("2d");
    this.options = options;
    this.draw();
  }
  draw() {
    new MonthTitle(this.context, __spreadValues({
      height: this.options.text.height,
      size: this.options.grid.size,
      offsetCellCount: this.offsetCellCount,
      space: this.options.grid.space
    }, this.options.text));
    this.drawGrid();
  }
  render(data) {
    this.context.clearRect(0, this.options.text.height, this.gridWidth, this.gridHeight);
    this.drawGrid(data);
  }
  setGridWidthHeight(days) {
    let { size, space } = this.options.grid;
    let column = Math.ceil((this.offsetCellCount + days) / 7);
    this.gridWidth = column * size + (column - 1) * space;
    this.gridHeight = 7 * size + 6 * space;
  }
  drawGrid(data) {
    let totalDays = isLeapYear() ? 366 : 365;
    let days = new Array(totalDays).fill(null);
    if (!this.gridWidth) {
      this.setGridWidthHeight(totalDays);
    }
    if (data) {
      const dataTmp = data.reduce((target, v) => {
        let day = getDayOfYear(new Date(v.date));
        target[day] = v;
        return target;
      }, {});
      for (let i = 0; i < days.length; i++) {
        days[i] = dataTmp[i];
      }
    }
    days.forEach((val, key) => {
      this.drawRect(key + 1, val ? val.count : 0);
    });
  }
  drawRect(index, count) {
    let { size, space, defaultColor, primaryColor } = this.options.grid;
    let [row, column] = this.getDayCellRowColumn(index);
    let x = column * size + column * space;
    let y = row * size + row * space;
    let color = defaultColor;
    if (count > 2) {
      color = primaryColor;
    } else if (count == 2) {
      color = getHexOpacityColor(primaryColor, 0.8);
    } else if (count == 1) {
      color = getHexOpacityColor(primaryColor, 0.5);
    }
    this.context.fillStyle = color;
    this.context.fillRect(x, this.options.text.height + y, size, size);
  }
  getDayCellRowColumn(day) {
    let { offsetCellCount } = this;
    let column = Math.ceil((day + offsetCellCount) / 7);
    let row = 7 - (7 * column - day - offsetCellCount);
    column = column - 1 > 0 ? column - 1 : 0;
    row = row - 1 > 0 ? row - 1 : 0;
    return [row, column];
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
export { CalendarGraph };
