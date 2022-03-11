<template>
  <canvas id="canvas" width="1000"></canvas>
</template>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import { onMounted } from 'vue'
import { CalendarGraph } from '../lib/index'

onMounted(() => {
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
})
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  background: #eee;
}
#canvas {
  background: #fff;
}
</style>
