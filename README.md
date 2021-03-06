# Calendar Graph

移动端类似于 github 提交日历的效果，基于 canvas 实现，兼容小程序。

## 在线 Demo

[https://zenonux.github.io/calendar-graph/](https://zenonux.github.io/calendar-graph/)

## 安装

```bash
npm i @urcloud/calendar-graph
```

## 使用

```ts
import { CalendarGraph } from '@urcloud/calendar-graph'
// 初始化
const calendarGraph = new CalendarGraph({
  devicePixelRatio: 1,
  titleHeight: 24,
  font: '14px Arial',
  fontColor: '#232323',
  borderColor: '#ddd',
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

// 获取title信息
console.log(calendarGraph.getMonthTitleInfo(0))

// 小程序canvas是异步获取的
calendarGraph.setCanvas(document.getElementById('canvas') as HTMLCanvasElement)
const data = [
  { date: '2022-2-10', count: 1 },
  { date: '2022-3-10', count: 1 },
  { date: '2022-3-11', count: 1 },
  { date: '2022-3-12', count: 2 },
  { date: '2022-3-13', count: 1 },
  { date: '2022-3-14', count: 3 },
]
// 等待数据加载后重新渲染画布
calendarGraph.render(data)
```


## 更新日志(v1.5.0)
- 新增typings
- 增加getMonthTitleInfo方法