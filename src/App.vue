<template>
  <canvas id="canvas"></canvas>
</template>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
import { onMounted } from 'vue';
import { CalendarGraph } from '../lib'
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

onMounted(() => {
  const calendarGraph = new CalendarGraph({
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
        return '#95aee1'
      }
      if (count == 2) {
        return '#5c88e5'
      }
      return '#0f55e5'
    }
  });
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
})

</script>
<style>
html,
html,
body {
  margin: 0;
  padding: 0;
  background: #ddd;
}

.calendar {
  position: relative;
  background: #fff;
}
.month,
.cell {
  z-index: 10;
  position: absolute;
}
.month {
  font-size: 12px;
  height: 24px;
  line-height: 24px;
}
.cell {
  background: #eee;
  width: 12px;
  height: 12px;
}
.cell-1 {
  background: red;
}
.cell-2 {
  background: green;
}
.cell-3 {
  background: blue;
}
</style>
