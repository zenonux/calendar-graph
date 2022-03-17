var Y=Object.defineProperty,F=Object.defineProperties;var R=Object.getOwnPropertyDescriptors;var M=Object.getOwnPropertySymbols;var P=Object.prototype.hasOwnProperty,S=Object.prototype.propertyIsEnumerable;var D=(a,n,l)=>n in a?Y(a,n,{enumerable:!0,configurable:!0,writable:!0,value:l}):a[n]=l,f=(a,n)=>{for(var l in n||(n={}))P.call(n,l)&&D(a,l,n[l]);if(M)for(var l of M(n))S.call(n,l)&&D(a,l,n[l]);return a},x=(a,n)=>F(a,R(n));var r=(a,n,l)=>(D(a,typeof n!="symbol"?n+"":n,l),l);(function(a,n){typeof exports=="object"&&typeof module!="undefined"?n(exports):typeof define=="function"&&define.amd?define(["exports"],n):(a=typeof globalThis!="undefined"?globalThis:a||self,n(a.CalendarGraph={}))})(this,function(a){"use strict";function n(h=new Date){let t=h.getFullYear();return t%4==0&&t%100!=0||t%400==0}function l(h=new Date){return new Date(h.getFullYear(),0,1)}function g(h=new Date){const t=Date.UTC(h.getFullYear(),h.getMonth(),h.getDate()),e=Date.UTC(h.getFullYear(),0,0);return(t-e)/1e3/60/60/24}function T(h){let t=[],e=7,i=z(h);for(;e;)t.push(g(i)-e+1),e--;return t}function z(h){return new Date(new Date().getFullYear(),h+1,0)}class m{constructor(t,e){r(this,"width");r(this,"height");r(this,"gridData");this.offsetCellCount=t,this.options=e,this.init()}init(){let t=n()?366:365;this.gridData=new Array(t).fill(null).map((e,i)=>this.getCellPostionByDay(i+1)),this.setGridWidthHeight(t)}setGridWidthHeight(t){let{size:e,space:i}=this.options,s=Math.ceil((this.offsetCellCount+t)/7);this.width=s*e+(s+2)*i,this.height=7*e+8*i}getCellPostionByDay(t){let{size:e,space:i}=this.options,[s,o]=this.getCellRowColumnByDay(t),c=o*e+o*i+i,u=this.options.offsetY+s*e+s*i+i;return{x:c,y:u}}getCellRowColumnByDay(t){let{offsetCellCount:e}=this,i=Math.ceil((t+e)/7),s=7-(7*i-t-e);return i=i-1>0?i-1:0,s=s-1>0?s-1:0,[s,i]}static mergeData(t,e){const i=e.reduce((s,o)=>{let c=g(new Date(o.date))-1;return s[c]=o,s},{});for(let s=0;s<t.length;s++)t[s]=f(f({},t[s]),i[s]);return t}}class b{constructor(t,e){r(this,"monthBoundaryData");r(this,"_topBoundaryData",[]);r(this,"_bottomBoundaryData",[]);this._grid=t,this._opts=e;let i=this._getBoundarySideLines(),s=this._topBoundaryData.sort((c,u)=>c.x-u.x),o=this._bottomBoundaryData.sort((c,u)=>c.x-u.x);this.monthBoundaryData=[...i,s,o]}_getMonthBoundaryDays(){let t=[];t.push({type:"front",value:[1,2,3,4,5,6,7]});for(let e=0;e<12;e++)t.push({type:"end",value:T(e)});return t}_getBoundaryLine(t,e){let i=[],s=[],o=[];t.forEach(p=>{let{x:d,y}=this._grid.getCellPostionByDay(p);e=="end"?d=d+this._opts.size+this._opts.space/2:d=d-this._opts.space/2,i.push(d),s.push(y),s.push(y+this._opts.size),o.push({x:d,y:y+this._opts.size}),o.push({x:d,y})});let c=Math.min(...i),u=Math.max(...i),C=Math.min(...s),B=Math.max(...s),w=[];if(u!=c){o=o.sort((_,W)=>_.y-W.y);let p=-1;for(let _=0;_<o.length;_++)if(o[_+1].y-o[_].y==this._opts.space&&o[_+1].x!=o[_].x){p=_;break}let d=x(f({},o[p]),{y:o[p].y+this._opts.space/2}),y=x(f({},o[p+1]),{y:o[p+1].y-this._opts.space/2});w=d.x<y.x?[d,y]:[y,d]}return this._bottomBoundaryData.push({x:c,y:B+this._opts.space/2}),this._topBoundaryData.push({x:u,y:C-this._opts.space/2}),[{x:c,y:B},...w,{x:u,y:C}]}_getBoundarySideLines(){return this._getMonthBoundaryDays().map(e=>this._getBoundaryLine(e.value,e.type))}}class H{constructor(t){r(this,"monthTitleData");this.init(t)}init(t){this.monthTitleData=new Array(12).fill(null).map((e,i)=>{let s=this.getMonthColumn(i,t.offsetCellCount);return{title:i+1+"\u6708",x:s*t.size+s*t.space+t.space/2,y:t.titleHeight/2}})}getMonthColumn(t,e){let i=new Date(new Date().getFullYear(),t,1),s=g(i),o=i.getDay(),c=Math.ceil((s+e)/7)-1;return o==1?c:c+1}}class G{constructor(t,e){r(this,"_context");r(this,"_ratio");this._options=e,this._context=t.getContext("2d"),this._ratio=this.initRatio(e.devicePixelRatio,this._context),t.width=e.calendarWidth*this._ratio,t.height=e.calendarHeight*this._ratio,this.render()}initRatio(t,e){t=t||window.devicePixelRatio||1;let i=e.webkitBackingStorePixelRatio||1;return t/i}render(t){this._context.clearRect(0,0,this._options.calendarWidth*this._ratio,this._options.calendarHeight*this._ratio);let{monthTitleData:e,gridData:i,monthBoundaryData:s}=this._options;t&&t.length>0&&(i=m.mergeData(i,t)),this.renderMonthTitle(e),this.renderGrid(i),this.renderMonthBoundary(s),this._context.scale(this._ratio,this._ratio)}renderMonthTitle(t){this._context.fillStyle=this._options.fontColor,this._context.font=this._options.font,this._context.textBaseline="middle",this._context.textAlign="left",t.forEach(e=>{this._context.fillText(e.title,e.x,e.y)})}renderMonthBoundary(t){this._context.strokeStyle=this._options.borderColor,this._context.lineWidth=this._options.space/2,this._context.beginPath(),this._context.setLineDash([this._options.space*2,this._options.space]),t.forEach(e=>{this._context.moveTo(e[0].x,e[0].y),e.forEach(i=>{this._context.lineTo(i.x,i.y)})}),this._context.stroke(),this._context.closePath()}renderGrid(t){t.forEach(e=>{this._context.fillStyle=this._options.colorFunc(e.count||0),this._context.fillRect(e.x,e.y,this._options.size,this._options.size)})}}class v{constructor(t){r(this,"canvasWidth");r(this,"canvasHeight");r(this,"_monthTitle");r(this,"_grid");r(this,"_canvasGraph");r(this,"_monthBoundary");this._options=t,this.init(t)}setCanvas(t){this._canvasGraph=new G(t,{devicePixelRatio:this._options.devicePixelRatio,calendarWidth:this.canvasWidth,calendarHeight:this.canvasHeight,gridData:this._grid.gridData,monthTitleData:this._monthTitle.monthTitleData,monthBoundaryData:this._monthBoundary.monthBoundaryData,size:this._options.size,space:this._options.space,font:this._options.font,colorFunc:this._options.colorFunc,fontColor:this._options.fontColor,borderColor:this._options.borderColor})}init(t){let e=this.getOffsetCellCount();this._monthTitle=new H({offsetCellCount:e,size:t.size,space:t.space,titleHeight:t.titleHeight}),this._grid=new m(e,{offsetY:t.titleHeight,size:t.size,space:t.space}),this.canvasWidth=this._grid.width,this.canvasHeight=this._grid.height+t.titleHeight,this._monthBoundary=new b(this._grid,{size:this._options.size,space:this._options.space})}getOffsetCellCount(){let t=0,e=l().getDay();return e==0?t=6:t=e-1,t}render(t){this._canvasGraph.render(t)}}a.CalendarGraph=v,Object.defineProperties(a,{__esModule:{value:!0},[Symbol.toStringTag]:{value:"Module"}})});
