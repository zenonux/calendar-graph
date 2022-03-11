# Calendar Graph

calendar graph like github for h5 & wechat miniprogram.

## Install

```bash
npm i @urcloud/calendar-graph
```

## Usage

```ts
import { CalendarGraph } from '@urcloud/calendar-graph'
const data = [
  { date: '2022-2-10', count: 1 },
  { date: '2022-3-10', count: 1 },
  { date: '2022-3-11', count: 1 },
  { date: '2022-3-12', count: 2 },
  { date: '2022-3-13', count: 1 },
  { date: '2022-3-14', count: 3 },
]
let calendarGraph = new CalendarGraph(
  document.getElementById('canvas') as HTMLCanvasElement,
  {
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
  }
)
calendarGraph.render(data)
```
