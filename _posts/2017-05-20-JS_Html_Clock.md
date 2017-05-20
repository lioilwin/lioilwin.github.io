---
layout: post
title: JavaScript_Html绘制时钟
tags: JavaScript
---
使用Html控件canvas，利用JavaScript绘制时钟

效果图如下：
![](http://img.blog.csdn.net/20170520180018370?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzIxMTU0Mzk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

```html

<!DOCTYPE html>
<html>
	<body>
		<canvas id="canvas" width="500" height="500" style="border:4px solid #00f;"/>
		<script>
			var canvas = document.getElementById("canvas");
			var context = canvas.getContext("2d");
					
			function drawClock(){
				// 清空画布(如不清空,之前画的指针会留下来)
				context.clearRect(0,0,500,500);
				
				var date = new Date();
				var sec = date.getSeconds();
				var min = date.getMinutes();
				var hours = date.getHours();
				hours = (hours+min/60)>12 ? hours-12 : hours;
				
				// 1.画外圆————————————————————————————————————————————
				context.beginPath();
				context.arc(250,250,200,0,360,false);			
				context.lineWidth = 10;
				context.strokeStyle = "#000";
				context.stroke();
				context.closePath();
				
				// 2.画时刻度————————————————————————————————————————————			
				for(var i=0;i<12;i++){
					// 旋转画布
					context.save();
					context.translate(250,250);
					context.rotate(i*30*Math.PI/180);
					// 画刻度线段
					context.beginPath();					
					context.moveTo(0,-170);
					context.lineTo(0,-190);
					context.lineWidth = 8;
					context.strokeStyle = "#f00";					
					context.stroke();
					context.closePath();
					// 恢复画布
					context.restore();
				}
				
				// 3.画分钟刻度————————————————————————————————————————————
				for(var i=0;i<60;i++){
					if(i%5==0)continue;
					// 旋转画布
					context.save();
					context.translate(250,250);
					context.rotate(i*6*Math.PI/180);
					// 画刻度线段
					context.beginPath();
					context.moveTo(0,-180);
					context.lineTo(0,-190);
					context.lineWidth = 6;
					context.strokeStyle = "#00f";
					context.stroke();
					context.closePath();
					// 恢复画布
					context.restore();
				}
				
				// 4.画小时指针————————————————————————————————————————————
				context.save();
				context.translate(250,250);
				context.rotate(hours*30*Math.PI/180);	
				// 画指针线段
				context.beginPath();
				context.moveTo(0,-120);
				context.lineTo(0,12);
				context.lineWidth = 8;
				context.strokeStyle = "#f00";
				context.stroke();
				context.closePath();
				// 恢复画布
				context.restore();
				
				// 5.画分钟指针————————————————————————————————————————————
				context.save();
				context.translate(250,250);
				context.rotate(min*6*Math.PI/180);
				// 画指针线段
				context.beginPath();
				context.moveTo(0,-160);
				context.lineTo(0,16);
				context.lineWidth = 6;
				context.strokeStyle = "#000";
				context.stroke();
				context.closePath();
				// 恢复画布				
				context.restore();
				
				// 5.画秒指针————————————————————————————————————————————
				context.save();
				context.translate(250,250);
				context.rotate(sec*6*Math.PI/180);
				// 画指针线段
				context.beginPath();
				context.moveTo(0,-175);
				context.lineTo(0,20);
				context.lineWidth = 2;
				context.strokeStyle = "#00f";
				context.stroke();
				context.closePath();
				// 恢复画布
				context.restore();
				
				// 6.画圆心————————————————————————————————————————————
				context.beginPath();			
				context.arc(250,250,6,0,360,false);
				context.fillStyle = "#f00";
				context.fill();	
				context.lineWidth = 4;
				context.strokeStyle = "#00f";
				context.stroke();
				context.closePath();
			}
			// 定时每秒画一次钟
			setInterval(drawClock,1000);
		</script>
	</body>
</html>

```