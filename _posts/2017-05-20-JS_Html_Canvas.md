---
layout: post
title: JavaScript-Html-绘图-canvas基础
tags: JavaScript
---
使用Html控件canvas，利用JavaScript自定义绘图

效果图如下：
![](http://img.blog.csdn.net/20170520174433520?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvcXFfMzIxMTU0Mzk=/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

```html

<!DOCTYPE html>
<html>
	<body>
		<canvas id="canvas" width="300" height="350" style="border:4px solid #000;"/>
		<script>			
			var canvas = document.getElementById("canvas");
			var context = canvas.getContext("2d");
			
			// 1.画线段
			context.beginPath();
			context.moveTo(10,10);
			context.lineTo(280,10);
			context.lineWidth = 8;
			context.strokeStyle = "#00f";
			context.stroke();
			context.closePath();
			
			// 2.画圆框
			context.beginPath();
			context.arc(60,80,50,0,360,false);
			context.lineWidth = 4;
			context.strokeStyle = "#f00";
			context.stroke();
			context.closePath();		
			// 画实心圆
			context.beginPath();
			context.arc(60,180,50,0,360,false);
			context.fillStyle = "#00f";
			context.fill();
			context.closePath();
			
			// 3.画矩形框
			context.beginPath();
			context.strokeRect(150,40,100,50);
			context.closePath();			
			// 画实心矩形
			context.beginPath();
			context.fillRect(150,90,100,50);
			context.closePath();
			
			// 4.添加图片
			context.beginPath();
			var image = new Image();
			image.src = "http://avatar.csdn.net/5/3/C/1_qq_32115439.jpg";
			context.drawImage(image,150,160,100,100);
			context.closePath();
			
			// 5.添加文字
			context.beginPath();
			context.font = "60px 宋体";			
		    context.fillText("lioil.win",10,320,280);
			context.closePath();
		</script>
	</body>
</html>

```

简书: http://www.jianshu.com/p/9e495ea9aea6   
CSDN博客: http://blog.csdn.net/qq_32115439/article/details/72582063   
GitHub博客：http://lioil.win/2017/05/20/JS_Html_Canvas.html   
Coding博客：http://c.lioil.win/2017/05/20/JS_Html_Canvas.html