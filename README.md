# Calendar Graph

移动端类似于 github 提交日历的效果，为了兼容小程序，仅实现逻辑部分，渲染部分不实现。

## 本地测试 demo

```bash
git clone https://github.com/zenonux/calendar-graph.git
cd calendar-graph
npm i
npm run dev
```

## 安装

```bash
npm i @urcloud/calendar-graph
```

## 使用

```ts
import { CalendarGraph } from '@urcloud/calendar-graph'
// 初始化
const calendarGraph = new CalendarGraph({
  titleHeight: 24,
  size: 12,
  space: 2,
})
console.log(calendarGraph)
let { monthTitleData, gridData, calendarWidth, calendarHeight } = calendarGraph
// 等待数据加载后重新渲染grid
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
