# Calendar Graph

移动端类似于 github 提交日历的效果，为了兼容小程序，仅实现逻辑部分，渲染部分不实现。

## 安装

```bash
npm i @urcloud/calendar-graph
```

## 使用

```ts
import { CalendarGraph } from '@urcloud/calendar-graph'
// 初始化
const calendarGraph = new CalendarGraph({
  grid: {
    size: 12,
    space: 2,
    defaultColor: '#ccc',
    primaryColor: '#2196f3',
  },
  text: {
    color: '#959494',
    height: 24,
    font: '14px sans-serif',
  },
})
console.log(calendarGraph)
let { monthTitleData, gridData, calendarWidth, calendarHeight } = calendarGraph

// 等待数据加载后重新渲染表格部分
const data = [
  { date: '2022-2-10', count: 1 },
  { date: '2022-3-10', count: 1 },
  { date: '2022-3-11', count: 1 },
  { date: '2022-3-12', count: 2 },
  { date: '2022-3-13', count: 1 },
  { date: '2022-3-14', count: 3 },
]
gridData = CalendarGraph.mergeData(gridData, data)
console.log(gridData)
```
