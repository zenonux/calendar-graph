<template>
  <canvas id="canvas"></canvas>
</template>
<script setup lang="ts">
import { onMounted } from 'vue'
import { CalendarGraph } from '../src'

onMounted(() => {
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
  console.log(calendarGraph.getMonthTitleInfo(3))

  calendarGraph.setCanvas(
    document.getElementById('canvas') as HTMLCanvasElement
  )
  const data = [
    { date: '2022-2-10', count: 1 },
    { date: '2022-3-10', count: 1 },
    { date: '2022-3-11', count: 1 },
    { date: '2022-3-12', count: 2 },
    { date: '2022-3-13', count: 1 },
    { date: '2022-3-14', count: 3 },
  ]
  calendarGraph.render(data)
})
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  background: #fff;
}
</style>
