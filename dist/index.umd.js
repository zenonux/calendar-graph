var v=Object.defineProperty,L=Object.defineProperties;var P=Object.getOwnPropertyDescriptors;var M=Object.getOwnPropertySymbols;var k=Object.prototype.hasOwnProperty,F=Object.prototype.propertyIsEnumerable;var m=(a,n,d)=>n in a?v(a,n,{enumerable:!0,configurable:!0,writable:!0,value:d}):a[n]=d,f=(a,n)=>{for(var d in n||(n={}))k.call(n,d)&&m(a,d,n[d]);if(M)for(var d of M(n))F.call(n,d)&&m(a,d,n[d]);return a},B=(a,n)=>L(a,P(n));var r=(a,n,d)=>(m(a,typeof n!="symbol"?n+"":n,d),d);(function(a,n){typeof exports=="object"&&typeof module!="undefined"?n(exports):typeof define=="function"&&define.amd?define(["exports"],n):(a=typeof globalThis!="undefined"?globalThis:a||self,n(a.CalendarGraph={}))})(this,function(a){"use strict";function n(h=new Date){let t=h.getFullYear();return t%4==0&&t%100!=0||t%400==0}function d(h=new Date){return new Date(h.getFullYear(),0,1)}function g(h=new Date){const t=Date.UTC(h.getFullYear(),h.getMonth(),h.getDate()),e=Date.UTC(h.getFullYear(),0,0);return(t-e)/1e3/60/60/24}function T(h){let t=[],e=7,i=z(h);for(;e;)t.push(g(i)-e+1),e--;return t}function z(h){return new Date(new Date().getFullYear(),h+1,0)}class C{constructor(t,e){r(this,"width");r(this,"height");r(this,"gridData");this.offsetCellCount=t,this.options=e,this.init()}init(){let t=n()?366:365;this.gridData=new Array(t).fill(null).map((e,i)=>this.getCellPostionByDay(i+1)),this.setGridWidthHeight(t)}setGridWidthHeight(t){let{size:e,space:i}=this.options,o=Math.ceil((this.offsetCellCount+t)/7);this.width=o*e+(o+2)*i,this.height=7*e+8*i}getCellPostionByDay(t){let{size:e,space:i}=this.options,[o,s]=this.getCellRowColumnByDay(t),l=s*e+s*i+i,c=this.options.offsetY+o*e+o*i+i;return{x:l,y:c}}getCellRowColumnByDay(t){let{offsetCellCount:e}=this,i=Math.ceil((t+e)/7),o=7-(7*i-t-e);return i=i-1>0?i-1:0,o=o-1>0?o-1:0,[o,i]}static mergeData(t,e){const i=e.reduce((o,s)=>{let l=g(new Date(s.date))-1;return o[l]=s,o},{});for(let o=0;o<t.length;o++)t[o]=f(f({},t[o]),i[o]);return t}}class b{constructor(t,e){r(this,"monthBoundaryData");r(this,"_topBoundaryData",[]);r(this,"_bottomBoundaryData",[]);this._grid=t,this._opts=e;let i=this._getBoundarySideLines(),o=this._topBoundaryData.sort((l,c)=>l.x-c.x),s=this._bottomBoundaryData.sort((l,c)=>l.x-c.x);this.monthBoundaryData=[...i,o,s]}_getMonthBoundaryDays(){let t=[];t.push({type:"front",value:[1,2,3,4,5,6,7]});for(let e=0;e<12;e++)t.push({type:"end",value:T(e)});return t}_getBoundaryLine(t,e){let i=[],o=[],s=[];t.forEach(p=>{let{x:u,y:_}=this._grid.getCellPostionByDay(p);e=="end"?u=u+this._opts.size+this._opts.space/2:u=u-this._opts.space/2,i.push(u),o.push(_),o.push(_+this._opts.size),s.push({x:u,y:_+this._opts.size}),s.push({x:u,y:_})});let l=Math.min(...i),c=Math.max(...i),x=Math.min(...o),D=Math.max(...o),w=[];if(c!=l){s=s.sort((y,Y)=>y.y-Y.y);let p=-1;for(let y=0;y<s.length;y++)if(s[y+1].y-s[y].y==this._opts.space&&s[y+1].x!=s[y].x){p=y;break}let u=B(f({},s[p]),{y:s[p].y+this._opts.space/2}),_=B(f({},s[p+1]),{y:s[p+1].y-this._opts.space/2});w=u.x<_.x?[u,_]:[_,u]}return this._bottomBoundaryData.push({x:l,y:D+this._opts.space/2}),this._topBoundaryData.push({x:c,y:x-this._opts.space/2}),[{x:l,y:D},...w,{x:c,y:x}]}_getBoundarySideLines(){return this._getMonthBoundaryDays().map(e=>this._getBoundaryLine(e.value,e.type))}}class H{constructor(t){r(this,"monthTitleData");this.init(t)}init(t){this.monthTitleData=new Array(12).fill(null).map((e,i)=>{let o=this.getMonthColumn(i,t.offsetCellCount);return{title:i+1+"\u6708",x:o*t.size+o*t.space+t.space/2,y:t.titleHeight/2}})}getMonthColumn(t,e){let i=new Date(new Date().getFullYear(),t,1),o=g(i),s=i.getDay(),l=Math.ceil((o+e)/7)-1;return s==1?l:l+1}}class G{constructor(t,e){r(this,"_context");r(this,"_ratio");this._options=e,this._context=t.getContext("2d"),this._ratio=this.initRatio(e.devicePixelRatio,this._context),t.width=e.calendarWidth*this._ratio,t.height=e.calendarHeight*this._ratio,this.render()}initRatio(t,e){t=t||window.devicePixelRatio||1;let i=e.webkitBackingStorePixelRatio||1;return t/i}render(t){this._context.clearRect(0,0,this._options.calendarWidth*this._ratio,this._options.calendarHeight*this._ratio);let{monthTitleData:e,gridData:i,monthBoundaryData:o,todayBoundaryData:s}=this._options;t&&t.length>0&&(i=C.mergeData(i,t)),this._context.scale(this._ratio,this._ratio),this.renderMonthTitle(e),this.renderGrid(i),this.renderMonthBoundary(o),this.renderTodayBoundary(s)}renderMonthTitle(t){this._context.fillStyle=this._options.fontColor,this._context.font=this._options.font,this._context.textBaseline="middle",this._context.textAlign="left",t.forEach(e=>{this._context.fillText(e.title,e.x,e.y)})}renderTodayBoundary(t){this._context.setLineDash([]),this._context.strokeStyle=this._options.borderColor,this._context.lineWidth=this._options.space/2,this._context.beginPath(),t.forEach(e=>{this._context.lineTo(e.x,e.y)}),this._context.closePath(),this._context.stroke()}renderMonthBoundary(t){this._context.strokeStyle=this._options.borderColor,this._context.lineWidth=this._options.space/2,this._context.beginPath(),this._context.setLineDash([this._options.space*2,this._options.space]),t.forEach(e=>{this._context.moveTo(e[0].x,e[0].y),e.forEach(i=>{this._context.lineTo(i.x,i.y)})}),this._context.stroke()}renderGrid(t){t.forEach(e=>{this._context.fillStyle=this._options.colorFunc(e.count||0),this._context.fillRect(e.x,e.y,this._options.size,this._options.size)})}}class R{constructor(t,e){r(this,"todayBoundaryData");let i=g(new Date),{x:o,y:s}=t.getCellPostionByDay(i),l={x:o-e.space/2,y:s-e.space/2},c={x:o+e.size+e.space/2,y:s-e.space/2},x={x:o-e.space/2,y:s+e.size+e.space/2},D={x:o+e.size+e.space/2,y:s+e.size+e.space/2};this.todayBoundaryData=[l,c,D,x]}}class W{constructor(t){r(this,"canvasWidth");r(this,"canvasHeight");r(this,"_monthTitle");r(this,"_grid");r(this,"_canvasGraph");r(this,"_monthBoundary");r(this,"_todayBoundary");this._options=t,this.init(t)}setCanvas(t){this._canvasGraph=new G(t,{devicePixelRatio:this._options.devicePixelRatio,calendarWidth:this.canvasWidth,calendarHeight:this.canvasHeight,gridData:this._grid.gridData,monthTitleData:this._monthTitle.monthTitleData,monthBoundaryData:this._monthBoundary.monthBoundaryData,todayBoundaryData:this._todayBoundary.todayBoundaryData,size:this._options.size,space:this._options.space,font:this._options.font,colorFunc:this._options.colorFunc,fontColor:this._options.fontColor,borderColor:this._options.borderColor})}init(t){let e=this.getOffsetCellCount();this._monthTitle=new H({offsetCellCount:e,size:t.size,space:t.space,titleHeight:t.titleHeight}),this._grid=new C(e,{offsetY:t.titleHeight,size:t.size,space:t.space}),this.canvasWidth=this._grid.width,this.canvasHeight=this._grid.height+t.titleHeight,this._monthBoundary=new b(this._grid,{size:this._options.size,space:this._options.space}),this._todayBoundary=new R(this._grid,{size:this._options.size,space:this._options.space})}getOffsetCellCount(){let t=0,e=d().getDay();return e==0?t=6:t=e-1,t}render(t){this._canvasGraph.render(t)}}a.CalendarGraph=W,Object.defineProperties(a,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
