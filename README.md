# Calendar Graph

移动端类似于 github 提交日历的效果，基于 canvas 实现，兼容小程序。

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
const calendarGraph = new CalendarGraph({
  borderColor: 'red',
  devicePixelRatio: 1,
  titleHeight: 24,
  font: '14px Arial',
  fontColor: '#232323',
  size: 12,
  space: 2,
  colorFunc: (count: number) => {
    if (count <= 0) {
      return '#f1f1f1'
    }
    if (count == 1) {
      return '#b2dbfb'
    }
    if (count == 2) {
      return '#6ab8f7'
    }
    return '#2196f3'
  },
})
calendarGraph.setCanvas(document.getElementById('canvas') as HTMLCanvasElement)
const data = [
  { date: '2022-2-10', count: 1 },
  { date: '2022-3-10', count: 1 },
  { date: '2022-3-11', count: 1 },
  { date: '2022-3-12', count: 2 },
  { date: '2022-3-13', count: 1 },
  { date: '2022-3-14', count: 3 },
]
calendarGraph.render(data)
```
