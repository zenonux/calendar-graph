<template>
  <div
    class="calendar"
    :style="{
      width: calendarWidth + 'px',
      height: calendarHeight + 'px'
    }"
  >
    <div
      class="month"
      :style="{ left: item.x + 'px', top: item.y + 'px' }"
      v-for="(item, index) in monthTitleData"
      :key="index"
    >{{ item.title }}</div>
    <div
      :class="'cell cell-' + (item.count || 'default')"
      :style="{ left: item.x + 'px', top: item.y + 'px' }"
      v-for="(item, index) in gridData"
      :key="index"
    ></div>
  </div>
</template>
<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
import { CalendarGraph } from '../lib'
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
const calendarGraph = new CalendarGraph({
  titleHeight: 24,
  size: 12,
  space: 2,
});
console.log(calendarGraph)
let { monthTitleData, gridData, calendarWidth, calendarHeight } = calendarGraph
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
